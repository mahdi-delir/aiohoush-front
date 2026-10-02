'use client'

import {
  FormEvent,
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import Button from '@/components/ui/button'

import {
  useCreateOrder,
  useOrderOptions,
} from '@/features/orders/hooks/use-orders'


export default function NewOrderPage() {
  const router = useRouter()

  const {
    data: options,
    isLoading,
  } = useOrderOptions()

  const createOrder =
    useCreateOrder()

  const [student, setStudent] =
    useState('')

  const [course, setCourse] =
    useState('')

  const [discount, setDiscount] =
    useState('0')

  const [message, setMessage] =
    useState<string | null>(null)


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMessage(null)

    try {
      await createOrder.mutateAsync({
        student: Number(student),

        items: [
          {
            course: Number(course),
            discount:
              Number(discount),
          },
        ],
      })

      router.replace(
        '/dashboard/orders',
      )

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'ثبت سفارش انجام نشد.',
      )
    }
  }


  if (isLoading) {
    return (
      <p>
        در حال دریافت اطلاعات...
      </p>
    )
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <h1 className="text-xl font-bold">
        ثبت سفارش جدید
      </h1>

      <div className="flex flex-col gap-2">
        <label htmlFor="student">
          شناسه دانشجو
        </label>

        <input
          id="student"
          type="number"
          min="1"
          value={student}
          onChange={(event) =>
            setStudent(
              event.target.value,
            )
          }
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="course">
          دوره
        </label>

        <select
          id="course"
          value={course}
          onChange={(event) =>
            setCourse(
              event.target.value,
            )
          }
          className="rounded-xl border border-white/10 bg-black px-4 py-3"
          required
        >
          <option value="">
            انتخاب دوره
          </option>

          {options?.courses.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
                {' - '}
                {item.price}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="discount">
          تخفیف
        </label>

        <input
          id="discount"
          type="number"
          min="0"
          value={discount}
          onChange={(event) =>
            setDiscount(
              event.target.value,
            )
          }
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        />
      </div>

      {message && (
        <p className="text-sm text-danger">
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={
          createOrder.isPending ||
          !student ||
          !course
        }
      >
        {createOrder.isPending
          ? 'در حال ثبت...'
          : 'ثبت سفارش'}
      </Button>
    </form>
  )
}