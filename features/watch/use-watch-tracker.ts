"use client";

import { useEffect, type RefObject } from "react";

/*
 * ردیابی تماشای ویدئوی جلسه یا ویدئوی هدیه.
 *
 * - روی اولین play یک «نوبت تماشا» در سرور ساخته می‌شود و اگر کاربر
 *   قبلاً بخشی از ویدئو را دیده باشد، از همان‌جا ادامه می‌دهد.
 * - بازه‌هایی که واقعاً پخش شده‌اند (بدون seek) جمع می‌شوند و هر
 *   FLUSH_INTERVAL_MS همراه رویدادها به سرور فرستاده می‌شوند.
 * - موقع pause، پایان ویدئو، مخفی شدن تب و ترک صفحه هم ارسال می‌شود.
 *
 * محاسبهٔ درصد و تکمیل جلسه کاملاً سمت سرور است.
 */

type WatchEventType =
  | "play"
  | "pause"
  | "seek"
  | "heartbeat"
  | "ended"
  | "rate_change"
  | "error";

type EndReason = "ended" | "navigation" | "inactivity" | "error";

interface WatchEvent {
  client_event_id: string;
  sequence: number;
  event_type: WatchEventType;
  position_ms: number;
  from_position_ms?: number;
  to_position_ms?: number;
  playback_rate?: number;
  occurred_at: string;
}

interface StartResponse {
  success: boolean;
  data?: {
    watch_id: string;
    resume_position_ms: number;
    completed: boolean;
  };
}

const FLUSH_INTERVAL_MS = 15_000;

// اگر بین دو timeupdate بیش از این جابه‌جایی رخ دهد، seek حساب می‌شود.
const MAX_CONTINUOUS_JUMP_MS = 4_000;

// کمتر از این مقدار، ادامهٔ پخش ارزش پرش ندارد.
const MIN_RESUME_MS = 5_000;
const RESUME_END_MARGIN_MS = 10_000;

/**
 * چه ویدئویی ردیابی شود: جلسهٔ دوره یا ویدئوی هدیه.
 * هر دو سمت سرور یک قالب دارند (شروع → watch_id، سپس batch رویدادها).
 */
export type WatchTarget =
  | { kind: "session"; id: number }
  | { kind: "gift"; id: number };

function watchUrls(target: WatchTarget) {
  return target.kind === "gift"
    ? {
        start: `/api/gift-videos/${target.id}/watch`,
        events: (watchId: string) => `/api/gift-watches/${watchId}/events`,
      }
    : {
        start: `/api/course-sessions/${target.id}/watch`,
        events: (watchId: string) => `/api/course-watches/${watchId}/events`,
      };
}

export function useWatchTracker(
  videoRef: RefObject<HTMLVideoElement | null>,
  target: WatchTarget | undefined,
  onProgress?: () => void,
) {
  // کلید پایدار؛ با هر رندر شیء جدید ساخته می‌شود ولی ردیابی نباید از نو شروع شود.
  const targetKey = target ? `${target.kind}:${target.id}` : null;

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !target) return;

    const urls = watchUrls(target);

    let watchId: string | null = null;
    let starting: Promise<string | null> | null = null;
    let sequence = 0;
    let events: WatchEvent[] = [];
    let ranges: Array<[number, number]> = [];
    let segmentStart: number | null = null;
    let lastTime = 0;
    let disposed = false;
    let completedReported = false;

    const positionMs = () => Math.max(0, Math.floor(video.currentTime * 1000));

    const durationMs = () =>
      Number.isFinite(video.duration) && video.duration > 0
        ? Math.floor(video.duration * 1000)
        : null;

    function push(
      eventType: WatchEventType,
      extra: Partial<WatchEvent> = {},
    ) {
      events.push({
        client_event_id: crypto.randomUUID(),
        sequence: ++sequence,
        event_type: eventType,
        position_ms: positionMs(),
        occurred_at: new Date().toISOString(),
        ...extra,
      });
    }

    function closeSegment(endMs = lastTime) {
      if (segmentStart !== null && endMs > segmentStart) {
        ranges.push([segmentStart, endMs]);
      }
      segmentStart = null;
    }

    // بخش در حال پخش را ثبت می‌کند ولی پخش ادامه دارد.
    function checkpoint() {
      if (segmentStart === null) return;
      const now = lastTime;
      if (now > segmentStart) ranges.push([segmentStart, now]);
      segmentStart = now;
    }

    // arrow function (نه function declaration) تا TypeScript بررسی
    // null بودن video در ابتدای effect را اینجا هم معتبر بداند.
    const applyResume = (resumeMs: number) => {
      const duration = durationMs();

      if (
        resumeMs >= MIN_RESUME_MS &&
        (!duration || resumeMs < duration - RESUME_END_MARGIN_MS) &&
        video.currentTime < 1
      ) {
        video.currentTime = resumeMs / 1000;
      }
    };

    function ensureWatch(): Promise<string | null> {
      if (watchId) return Promise.resolve(watchId);

      if (!starting) {
        starting = fetch(urls.start, {
          method: "POST",
          credentials: "same-origin",
        })
          .then((response) => response.json() as Promise<StartResponse>)
          .then((body) => {
            if (!body.success || !body.data) return null;
            if (disposed) return null;
            watchId = body.data.watch_id;
            applyResume(body.data.resume_position_ms);
            return watchId;
          })
          .catch(() => null)
          .finally(() => {
            starting = null;
          });
      }

      return starting;
    }

    function takeBatch(endReason?: EndReason) {
      if (events.length === 0) push("heartbeat");

      const batch = {
        events,
        ranges,
        position_ms: positionMs(),
        duration_ms: durationMs(),
        ...(endReason ? { end_reason: endReason } : {}),
      };

      events = [];
      ranges = [];

      return batch;
    }

    async function flush(endReason?: EndReason) {
      if (!watchId) return;

      const id = watchId;
      const batch = takeBatch(endReason);

      if (endReason) watchId = null;

      try {
        const response = await fetch(urls.events(id), {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
        });
        const body = await response.json().catch(() => null);

        if (body?.success) {
          // فقط وقتی وضعیت جلسه عوض شده، لیست جلسات تازه شود.
          const completed = Boolean(body.data?.completed);
          if (endReason || (completed && !completedReported)) {
            completedReported = completed;
            onProgress?.();
          }
        } else if (!endReason && body && body.success === false) {
          // نوبت تماشا در سرور بسته شده؛ play بعدی نوبت جدید می‌سازد.
          watchId = null;
        }
      } catch {
        // قطعی شبکه: دادهٔ این batch را برمی‌گردانیم تا دفعهٔ بعد برود.
        // تکرار رویدادها در سرور با client_event_id حذف می‌شود.
        if (!endReason) {
          events = [...batch.events, ...events];
          ranges = [...batch.ranges, ...ranges];
        }
      }
    }

    // ارسال هنگام ترک صفحه؛ keepalive درخواست را بعد از بسته شدن صفحه
    // هم زنده نگه می‌دارد.
    function flushOnLeave(endReason?: EndReason) {
      if (!watchId) return;

      checkpoint();
      closeSegment();

      const id = watchId;
      const batch = takeBatch(endReason);

      if (endReason) watchId = null;

      fetch(urls.events(id), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
        keepalive: true,
      }).catch(() => {});
    }

    // --- رویدادهای پلیر
    const onPlay = () => {
      push("play");
      void ensureWatch();
    };

    const onPlaying = () => {
      segmentStart = positionMs();
      lastTime = segmentStart;
    };

    const onTimeUpdate = () => {
      if (segmentStart === null || video.paused) return;

      const now = positionMs();

      if (now >= lastTime && now - lastTime <= MAX_CONTINUOUS_JUMP_MS) {
        lastTime = now;
      } else {
        closeSegment(lastTime);
        segmentStart = now;
        lastTime = now;
      }
    };

    const onPause = () => {
      if (video.ended) return;
      closeSegment(positionMs());
      lastTime = positionMs();
      push("pause");
      void flush();
    };

    const onSeeking = () => {
      closeSegment(lastTime);
      push("seek", {
        from_position_ms: lastTime,
        to_position_ms: positionMs(),
      });
    };

    const onSeeked = () => {
      lastTime = positionMs();
      if (!video.paused) segmentStart = lastTime;
    };

    const onWaiting = () => {
      closeSegment(lastTime);
    };

    const onRateChange = () => {
      push("rate_change", { playback_rate: video.playbackRate });
    };

    const onEnded = () => {
      closeSegment(positionMs());
      push("ended");
      void flush("ended");
    };

    const onError = () => {
      push("error");
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushOnLeave();
    };

    const onPageHide = () => flushOnLeave("navigation");

    video.addEventListener("play", onPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("ratechange", onRateChange);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    const interval = window.setInterval(() => {
      if (video.paused) return;

      // نوبت قبلی در سرور بسته شده ولی پخش ادامه دارد
      if (!watchId) {
        void ensureWatch();
        return;
      }

      checkpoint();
      push("heartbeat");
      void flush();
    }, FLUSH_INTERVAL_MS);

    return () => {
      // تعویض جلسه یا خروج از صفحهٔ دوره
      flushOnLeave("navigation");
      disposed = true;

      window.clearInterval(interval);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("ratechange", onRateChange);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
    };
    // onProgress و target عمداً در وابستگی‌ها نیستند؛ targetKey همان target
    // است و با هر رندر عوض نمی‌شود.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, targetKey]);
}
