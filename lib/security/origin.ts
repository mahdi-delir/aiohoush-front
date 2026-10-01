import 'server-only'


export class InvalidOriginError extends Error {
  constructor() {
    super('Invalid request origin')
  }
}


export function assertTrustedOrigin(
  request: Request,
): void {
  const expectedOrigin =
    process.env.APP_ORIGIN

  if (!expectedOrigin) {
    throw new Error(
      'APP_ORIGIN is not configured',
    )
  }

  const origin =
    request.headers.get('origin')

  if (origin !== expectedOrigin) {
    throw new InvalidOriginError()
  }
}