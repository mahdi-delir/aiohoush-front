import 'server-only'


function getPositiveNumberEnv(name: string): number {
  const raw = process.env[name]

  if (!raw) {
    throw new Error(`${name} is not configured`)
  }

  const value = Number(raw)

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive`)
  }

  return value
}


function getDjangoUrl(path: string): string {
  const base = process.env.DJANGO_API_URL

  if (!base) {
    throw new Error('DJANGO_API_URL is not configured')
  }

  return new URL(path, base).toString()
}


export async function postDjangoJson(
  path: string,
  body: unknown,
): Promise<Response> {
  const controller = new AbortController()

  const timeout = setTimeout(
    () => controller.abort(),
    getPositiveNumberEnv(
      'DJANGO_REQUEST_TIMEOUT_MS',
    ),
  )

  try {
    return await fetch(
      getDjangoUrl(path),
      {
        method: 'POST',

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),

        cache: 'no-store',
        signal: controller.signal,
      },
    )
  } finally {
    clearTimeout(timeout)
  }
}


export async function forwardDjangoResponse(
  response: Response,
): Promise<Response> {
  const body = await response.text()

  return new Response(
    body,
    {
      status: response.status,

      headers: {
        'Content-Type':
          response.headers.get('Content-Type')
          ?? 'application/json',
      },
    },
  )
}