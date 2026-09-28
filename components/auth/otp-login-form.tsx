"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  hasCodeCharacters,
  hasPhoneCharacters,
  normalizeDigits,
  normalizePhoneInput,
} from "@/lib/auth-input";
import AuthIcon from "./auth-icon";

type Step = "phone" | "code" | "preview";

const primaryButton =
  "inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-primary-green px-5 py-3 text-sm font-bold text-black hover:bg-primary-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve motion-safe:transition-colors";

export default function OtpLoginForm() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef<Step>("phone");

  useEffect(() => {
    if (step === previousStep.current) return;
    if (step === "phone") phoneRef.current?.focus();
    if (step === "code") codeRef.current?.focus();
    if (step === "preview") resultRef.current?.focus();
    previousStep.current = step;
  }, [step]);

  function editPhone() {
    setCode("");
    setError("");
    setNotice("");
    setStep("phone");
  }

  function previewCodeStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = normalizePhoneInput(phone);
    if (!hasPhoneCharacters(normalizedPhone)) {
      setError("شماره موبایل را با ارقام و در صورت نیاز علامت + وارد کنید.");
      phoneRef.current?.focus();
      return;
    }
    setPhone(normalizedPhone);
    setError("");
    setNotice("");
    setCode("");
    // UI preview only: this is not a successful SMS request.
    setStep("code");
  }

  function previewCompletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = normalizeDigits(code).trim();
    if (!hasCodeCharacters(normalizedCode)) {
      setError("کد را فقط با ارقام وارد کنید.");
      codeRef.current?.focus();
      return;
    }
    // No OTP verification, session, token, redirect or authenticated state.
    setError("");
    setCode("");
    setStep("preview");
  }

  return (
    <section
      aria-labelledby="auth-heading"
      className="rounded-square border border-white/10 bg-card-bg p-6 shadow-2xl shadow-black/20 sm:p-9"
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <span
          className="grid size-14 place-items-center rounded-2xl border border-primary-green/20 bg-approve-bg text-approve"
        >
          <AuthIcon checked={step === "preview"} />
        </span>
        <ol aria-label="مراحل ورود" className="flex items-center gap-2 text-xs">
          <li
            aria-current={step === "phone" ? "step" : undefined}
            className={step === "phone" ? "text-approve" : "text-text-muted"}
          >
            ۱. شماره
          </li>
          <li aria-hidden="true" className="h-px w-5 bg-white/15" />
          <li
            aria-current={step === "code" ? "step" : undefined}
            className={step === "code" ? "text-approve" : "text-text-muted"}
          >
            ۲. تأیید
          </li>
        </ol>
      </div>

      <p
        id="auth-demo-notice"
        className="mb-6 rounded-xl border border-approve/15 bg-approve-bg/40 px-3 py-2 text-xs leading-6 text-text-muted"
      >
        پیش‌نمایش طراحی: پیامک ارسال نمی‌شود و ورود واقعی انجام نمی‌شود.
      </p>

      {step === "preview" ? (
        <div className="space-y-5">
          <h1
            id="auth-heading"
            ref={resultRef}
            tabIndex={-1}
            className="text-2xl font-bold focus:outline-none"
          >
            پیش‌نمایش تکمیل شد
          </h1>
          <p className="text-sm leading-8 text-text-muted">
            مراحل فرم را مشاهده کردید. اعتبار کد بررسی نشده و هنوز وارد حساب کاربری نشده‌اید.
          </p>
          <button type="button" onClick={editPhone} className={primaryButton}>
            بازگشت به فرم ورود
          </button>
        </div>
      ) : (
        <>
          <h1 id="auth-heading" className="text-2xl leading-normal font-bold">
            {step === "phone" ? "به آیوهوش خوش اومدی" : "کد ورودت رو وارد کن"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            {step === "phone"
              ? "برای ورود با رمز یک‌بارمصرف، شماره موبایلت را وارد کن."
              : "کد تأیید مربوط به شمارهٔ زیر را وارد کن."}
          </p>

          {step === "phone" ? (
            <form
              onSubmit={previewCodeStep}
              noValidate
              aria-describedby="auth-demo-notice"
              className="mt-7 space-y-5"
            >
              <div>
                <label htmlFor="auth-phone" className="mb-3 block text-sm font-medium">شماره موبایل</label>
                <input
                  ref={phoneRef}
                  id="auth-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(event) => {
                    setPhone(normalizeDigits(event.target.value));
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "auth-phone-hint auth-error" : "auth-phone-hint"}
                  className="min-h-14 w-full rounded-2xl border border-white/15 bg-element-bg/60 px-4 py-3 text-lg tracking-wide caret-approve outline-none focus-visible:border-approve focus-visible:ring-2 focus-visible:ring-approve/20"
                />
                <p id="auth-phone-hint" className="mt-3 text-xs leading-6 text-text-muted">
                  شماره‌ای را وارد کن که به پیامک‌های آن دسترسی داری.
                </p>
              </div>
              {error && <p id="auth-error" role="alert" className="text-sm leading-6 text-rose-300">{error}</p>}
              <button type="submit" className={primaryButton}>
                ادامه و دریافت کد
                <span aria-hidden="true">←</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={previewCompletion}
              noValidate
              aria-describedby="auth-demo-notice"
              className="mt-5 space-y-5"
            >
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/5 bg-element-bg/40 px-4 py-2"
              >
                <bdi dir="ltr" className="text-sm font-medium tracking-wide wrap-anywhere">{phone}</bdi>
                <button
                  type="button"
                  onClick={editPhone}
                  className="
                    min-h-11 cursor-pointer rounded-lg px-2 text-xs font-medium text-approve
                    hover:bg-approve-bg focus-visible:outline-2 focus-visible:outline-approve
                  "
                >
                  ویرایش شماره
                </button>
              </div>
              <div>
                <label htmlFor="auth-code" className="mb-3 block text-sm font-medium">کد یک‌بارمصرف</label>
                <input
                  ref={codeRef}
                  id="auth-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  enterKeyHint="done"
                  spellCheck={false}
                  dir="ltr"
                  required
                  value={code}
                  onChange={(event) => {
                    setCode(normalizeDigits(event.target.value));
                    setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "auth-code-hint auth-error" : "auth-code-hint"}
                  className="min-h-16 w-full rounded-2xl border border-white/15 bg-element-bg/60 px-4 py-3 text-center text-2xl tracking-widest caret-approve outline-none focus-visible:border-approve focus-visible:ring-2 focus-visible:ring-approve/20"
                />
                <p id="auth-code-hint" className="mt-3 text-xs leading-6 text-text-muted">
                  برای مشاهدهٔ مرحلهٔ بعد، یک کد عددی نمونه وارد کن.
                </p>
              </div>
              {error && <p id="auth-error" role="alert" className="text-sm leading-6 text-rose-300">{error}</p>}
              <button type="submit" className={primaryButton}>پیش‌نمایش تأیید و ورود</button>
              <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
                <span className="text-text-muted">کد را دریافت نکردی؟</span>
                <button
                  type="button"
                  onClick={() => {
                    setNotice("ارسال مجدد در نسخهٔ متصل به سرویس پیامک فعال می‌شود؛ فعلاً پیامکی ارسال نشده است.");
                  }}
                  className="min-h-11 cursor-pointer rounded-lg px-2 font-medium text-approve hover:bg-approve-bg focus-visible:outline-2 focus-visible:outline-approve"
                >
                  ارسال مجدد کد
                </button>
              </div>
              <p role="status" className="text-center text-xs leading-6 text-text-muted">{notice}</p>
            </form>
          )}
        </>
      )}
    </section>
  );
}
