export interface SaleCourse {
  id: number
  title: string
  price: string
}


export interface OrderOptions {
  courses: SaleCourse[]
}


export interface OrderProduct {
  id: number
  course: number
  course_title: string
  price: string
  discount: string
  final_price: number
}


export interface Order {
  id: number
  student: number
  seller: number | null
  created_by: number
  checked_by: number | null

  status:
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected'

  is_deleted: boolean

  requested_products:
    OrderProduct[]

  created_at: string
  updated_at: string
}


export interface CreateOrderInput {
  student: number

  items: {
    course: number
    discount: number
  }[]
}