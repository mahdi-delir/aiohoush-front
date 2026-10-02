export interface CurrentUser {
  id: number
  first_name: string
  last_name: string
  mobile: string
}


export interface ActiveCourse {
  id: number
  title: string
  all_sessions: number
  current_session: number
  completed_percent: number
}


export interface UserData {
  watched_gift?: boolean
  has_course?: boolean
  active_courses?: ActiveCourse[]
}


export interface MeResponse {
  user: CurrentUser
  groups: string[]
  permissions: string[]
  user_data: UserData
}