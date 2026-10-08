'use client'

import {
  FormEvent,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

import {
  ApiClientError,
} from '@/lib/api/client'

import {
  getDeviceLimit,
  type DeviceLimit,
} from '@/lib/api/auth'

import {
  useRequestLoginOtp,
  useVerifyLoginOtp,
} from '../hooks/use-login-otp'
import { LoginDevices } from './login-devices'
import {
  OtpCountdown,
  useSecondsLeft,
} from './otp-countdown'
import Input from '@/components/ui/text-input'
import Button from '@/components/ui/button'


const DEFAULT_OTP_SECONDS = 120


type Step =
  | 'mobile'
  | 'otp'
  | 'devices'


export function LoginOtpForm() {
  const router = useRouter()

  const [step, setStep] =
    useState<Step>('mobile')

  const [mobile, setMobile] =
    useState('')

  const [code, setCode] =
    useState('')

  const [message, setMessage] =
    useState<string | null>(null)

  const [deviceLimit, setDeviceLimit] =
    useState<DeviceLimit | null>(null)

  const [otpDeadline, setOtpDeadline] =
    useState<number | null>(null)

  const secondsLeft =
    useSecondsLeft(otpDeadline)

  const requestOtp =
    useRequestLoginOtp()

  const verifyOtp =
    useVerifyLoginOtp()


  async function sendOtp() {
    setMessage(null)

    try {
      const response =
        await requestOtp.mutateAsync(
          mobile,
        )

      const seconds =
        response.data?.expires_in ??
        DEFAULT_OTP_SECONDS

      setOtpDeadline(
        Date.now() + seconds * 1000,
      )
      setCode('')
      setMessage(response.message)
      setStep('otp')

    } catch (error) {
      if (
        error instanceof ApiClientError
      ) {
        setMessage(error.message)
        return
      }

      setMessage(
        'خطایی در ارتباط با سرور رخ داد.',
      )
    }
  }


  function handleRequestOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    void sendOtp()
  }


  function goToDashboard() {
    router.replace('/dashboard')
    router.refresh()
  }


  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMessage(null)

    try {
      await verifyOtp.mutateAsync({
        mobile,
        code,
      })

      goToDashboard()

    } catch (error) {
      const limit = getDeviceLimit(error)

      if (limit) {
        setDeviceLimit(limit)
        setStep('devices')
        return
      }

      if (
        error instanceof ApiClientError
      ) {
        setMessage(error.message)
        return
      }

      setMessage(
        'خطایی در ارتباط با سرور رخ داد.',
      )
    }
  }


  if (step === 'devices' && deviceLimit) {
    return (
      <LoginDevices
        limit={deviceLimit}
        onLimitChange={setDeviceLimit}
        onExpired={(text) => {
          setDeviceLimit(null)
          setCode('')
          setMessage(text)
          setStep('mobile')
        }}
        onLoggedIn={goToDashboard}
      />
    )
  }


  if (step === 'mobile') {
    return (
      <form
        onSubmit={handleRequestOtp}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="mobile">
            شماره موبایل
          </label>

          <Input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={mobile}
            onChange={(event) =>
              setMobile(
                event.target.value,
              )
            }
            disabled={
              requestOtp.isPending
            }
            className="rounded-xl outline-none"
          />
        </div>

        {message && (
          <p className="text-sm">
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            requestOtp.isPending ||
            !mobile.trim()
          }
        >
          {requestOtp.isPending
            ? 'در حال ارسال...'
            : 'دریافت کد ورود'}
        </Button>
      </form>
    )
  }


  return (
    <form
      onSubmit={handleVerifyOtp}
      className="flex w-full flex-col gap-4"
    >
      <div>
        <p className="text-sm">
          کد ارسال‌شده به
        </p>

        <p dir="ltr">
          {mobile}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="code">
          کد تأیید
        </label>

        <Input
          id="code"
          name="code"
          type="text"
          dir = 'ltr'
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) =>
            setCode(
              event.target.value
                .replace(/\D/g, '')
                .slice(0, 6),
            )
          }
          disabled={
            verifyOtp.isPending
          }
        />

        <OtpCountdown
          secondsLeft={secondsLeft}
          resending={requestOtp.isPending}
          onResend={() => void sendOtp()}
        />
      </div>

      {message && (
        <p className="text-sm">
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={
          verifyOtp.isPending ||
          code.length !== 6 ||
          secondsLeft === 0
        }
        className="disabled:opacity-50"
      >
        {verifyOtp.isPending
          ? 'در حال بررسی...'
          : 'ورود'}
      </Button>

      <Button
        type="button"
        variant='secondary'
        disabled={
          verifyOtp.isPending
        }
        onClick={() => {
          setCode('')
          setMessage(null)
          setOtpDeadline(null)
          setStep('mobile')
        }}
        className="text-sm"
      >
        تغییر شماره موبایل
      </Button>
    </form>
  )
}