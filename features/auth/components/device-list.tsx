'use client'

import type {
  ActiveSession,
} from '@/lib/api/auth'


const dateFormatter = new Intl.DateTimeFormat(
  'fa-IR-u-ca-persian',
  {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
)


function joinParts(...parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ')
}


export function deviceTitle(session: ActiveSession) {
  const device = joinParts(
    session.device_brand,
    session.device_model,
  )
  const os = joinParts(
    session.os_name,
    session.os_version,
  )

  return device || os || 'دستگاه ناشناس'
}


function deviceDetails(session: ActiveSession) {
  const browser = joinParts(
    session.browser_name,
    session.browser_version,
  )
  const os = joinParts(
    session.os_name,
    session.os_version,
  )
  const device = joinParts(
    session.device_brand,
    session.device_model,
  )

  return [
    device ? os : '',
    browser,
  ]
    .filter(Boolean)
    .join(' · ')
}


function lastActivity(session: ActiveSession) {
  const date = new Date(
    session.last_used_at ?? session.created_at,
  )

  return Number.isNaN(date.getTime())
    ? ''
    : dateFormatter.format(date)
}


export function DeviceList({
  sessions,
  busyId,
  disabled,
  onRevoke,
}: {
  sessions: ActiveSession[]
  busyId: string | null
  disabled: boolean
  onRevoke: (sessionId: string) => void
}) {
  if (sessions.length === 0) {
    return (
      <p className="rounded-icon bg-card-bg p-4 text-sm text-text-muted">
        دستگاه فعالی پیدا نشد.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {sessions.map((session) => {
        const details = deviceDetails(session)
        const activity = lastActivity(session)

        return (
          <li
            key={session.id}
            className="flex items-center justify-between gap-3 rounded-icon bg-card-bg p-4"
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                <span className="truncate">
                  {deviceTitle(session)}
                </span>

                {session.is_current && (
                  <span className="rounded-full bg-primary-green/20 px-2 py-0.5 text-xs text-primary-green">
                    این دستگاه
                  </span>
                )}
              </p>

              {details && (
                <p className="mt-1 truncate text-xs text-text-muted">
                  {details}
                </p>
              )}

              {activity && (
                <p className="mt-1 text-xs text-text-muted">
                  آخرین فعالیت: {activity}
                </p>
              )}
            </div>

            {!session.is_current && (
              <button
                type="button"
                onClick={() => onRevoke(session.id)}
                disabled={disabled}
                className="shrink-0 rounded-xl bg-danger/15 px-3.5 py-2 text-sm text-danger disabled:opacity-50"
              >
                {busyId === session.id
                  ? 'در حال خروج...'
                  : 'خروج'}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
