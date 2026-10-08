'use client'

import {
  useState,
} from 'react'

import Button from '@/components/ui/button'

import {
  ApiClientError,
} from '@/lib/api/client'

import {
  getDeviceLimit,
  type DeviceLimit,
} from '@/lib/api/auth'

import {
  useFreeLoginDevice,
} from '../hooks/use-login-otp'

import {
  DeviceList,
} from './device-list'


export function LoginDevices({
  limit,
  onLimitChange,
  onExpired,
  onLoggedIn,
}: {
  limit: DeviceLimit
  onLimitChange: (limit: DeviceLimit) => void
  onExpired: (message: string) => void
  onLoggedIn: () => void
}) {
  const freeDevice =
    useFreeLoginDevice()

  const [busyId, setBusyId] =
    useState<string | null>(null)

  const [message, setMessage] =
    useState<string | null>(null)


  async function free(
    sessionId: string | null,
  ) {
    if (
      sessionId === null &&
      !window.confirm(
        'از همه‌ی دستگاه‌ها خارج می‌شوید و فقط با همین دستگاه وارد می‌شوید. ادامه می‌دهید؟',
      )
    ) {
      return
    }

    setBusyId(sessionId ?? 'all')
    setMessage(null)

    try {
      await freeDevice.mutateAsync({
        ticket: limit.ticket,
        sessionId,
      })

      onLoggedIn()

    } catch (error) {
      const next = getDeviceLimit(error)

      if (next) {
        onLimitChange(next)
        return
      }

      if (
        error instanceof ApiClientError &&
        error.response
      ) {
        onExpired(error.message)
        return
      }

      setMessage(
        'خطایی در ارتباط با سرور رخ داد.',
      )

    } finally {
      setBusyId(null)
    }
  }


  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">
          دستگاه‌های فعال
        </h2>

        <p className="text-sm leading-7 text-text-muted">
          با این حساب حداکثر روی{' '}
          {limit.max_devices.toLocaleString('fa-IR')}{' '}
          دستگاه می‌توانید وارد باشید. برای ورود با این دستگاه، از یکی از دستگاه‌های زیر خارج شوید.
        </p>
      </div>

      <DeviceList
        sessions={limit.sessions}
        busyId={busyId}
        disabled={freeDevice.isPending}
        onRevoke={(sessionId) => free(sessionId)}
      />

      {message && (
        <p className="text-sm">
          {message}
        </p>
      )}

      <Button
        type="button"
        variant="danger"
        disabled={freeDevice.isPending}
        onClick={() => free(null)}
      >
        {busyId === 'all'
          ? 'در حال خروج...'
          : 'خروج از همه‌ی دستگاه‌ها'}
      </Button>
    </div>
  )
}
