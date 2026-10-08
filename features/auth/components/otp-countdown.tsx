'use client'

import {
  useEffect,
  useState,
} from 'react'


export function useSecondsLeft(
  deadline: number | null,
) {
  const [now, setNow] =
    useState(() => Date.now())

  useEffect(() => {
    if (deadline === null) {
      return
    }

    setNow(Date.now())

    const timer = window.setInterval(
      () => setNow(Date.now()),
      1000,
    )

    return () => window.clearInterval(timer)
  }, [deadline])

  if (deadline === null) {
    return 0
  }

  return Math.max(
    0,
    Math.ceil((deadline - now) / 1000),
  )
}


function formatClock(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60

  return `${minutes}:${String(rest).padStart(2, '0')}`
    .replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])
}


export function OtpCountdown({
  secondsLeft,
  resending,
  onResend,
}: {
  secondsLeft: number
  resending: boolean
  onResend: () => void
}) {
  if (secondsLeft > 0) {
    return (
      <p
        className="text-sm text-text-muted"
        aria-live="off"
      >
        اعتبار کد:{' '}
        <span
          dir="ltr"
          className="inline-block min-w-10 text-center font-medium text-text-primary tabular-nums"
        >
          {formatClock(secondsLeft)}
        </span>
      </p>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p
        role="status"
        className="text-sm text-text-muted"
      >
        کد منقضی شد.
      </p>

      <button
        type="button"
        onClick={onResend}
        disabled={resending}
        className="text-sm font-medium text-primary-green disabled:opacity-50"
      >
        {resending
          ? 'در حال ارسال...'
          : 'ارسال مجدد کد'}
      </button>
    </div>
  )
}
