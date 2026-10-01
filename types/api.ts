export interface ApiResponse<T = undefined> {
  success: boolean
  message: string
  detail?: unknown
  called_by?: 'app' | 'site' | 'webapp'
  data?: T
}