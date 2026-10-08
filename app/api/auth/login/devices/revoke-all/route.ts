import {
  loginThroughDjango,
} from '@/lib/auth/login-session'


export const runtime = 'nodejs'


export async function POST(
  request: Request,
): Promise<Response> {
  return loginThroughDjango(
    request,
    '/auth/login/devices/revoke-all/',
    ({ ticket }) => ({ ticket }),
  )
}
