import type {
  ApiResponse,
} from '@/types/api'


export class ApiClientError<T = unknown>
  extends Error {

  constructor(
    message: string,
    public readonly status: number,
    public readonly response:
      ApiResponse<T> | null,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}


export async function apiFetch<T>(
  input: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {

  const headers =
    new Headers(init.headers)

  headers.set(
    'Accept',
    'application/json',
  )

  if (
    init.body &&
    !(init.body instanceof FormData)
  ) {
    headers.set(
      'Content-Type',
      'application/json',
    )
  }

  const response = await fetch(
    input,
    {
      ...init,
      headers,

      /*
       * APIهای ما same-origin هستند.
       * Cookie __Host-session به BFF ارسال می‌شود.
       */
      credentials: 'same-origin',
    },
  )

  let body: ApiResponse<T> | null = null

  try {
    body =
      await response.json() as ApiResponse<T>
  } catch {
    // response غیر JSON
  }

  if (!response.ok) {
    throw new ApiClientError(
      body?.message ??
        'خطایی در ارتباط با سرور رخ داد.',
      response.status,
      body,
    )
  }

  if (!body) {
    throw new ApiClientError(
      'پاسخ سرور معتبر نیست.',
      response.status,
      null,
    )
  }

  return body
}