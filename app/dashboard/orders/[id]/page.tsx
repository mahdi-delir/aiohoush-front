'use client'

import {
  useParams,
} from 'next/navigation'

import Button from '@/components/ui/button'

import {
  useAuthorization,
} from '@/features/auth/hooks/use-authorization'

import {
  useApproveOrder,
  useOrder,
  useRejectOrder,
} from '@/features/orders/hooks/use-orders'

import {
  PERMISSIONS,
} from '@/config/permissions'


export default function OrderPage() {
  const params =
    useParams<{
      id: string
    }>()

  const id =
    Number(params.id)

  const {
    data: order,
    isLoading,
    error,
  } = useOrder(id)

  const approveMutation =
    useApproveOrder(id)

  const rejectMutation =
    useRejectOrder(id)

  const {
    hasPermission,
  } = useAuthorization()

  const canApprove =
    hasPermission(
      'order.approve_order',
    )

  const canReject =
    hasPermission(
      'order.reject_order',
    )


  if (isLoading) {
    return (
      <p>
        در حال دریافت سفارش...
      </p>
    )
  }


  if (error || !order) {
    return (
      <p>
        دریافت سفارش با خطا مواجه شد.
      </p>
    )
  }


  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold">
          سفارش #{order.id}
        </h1>

        <p className="text-sm">
          وضعیت: {order.status}
        </p>

        <p className="text-sm">
          دانشجو: {order.student}
        </p>

        <p className="text-sm">
          فروشنده:{' '}
          {order.seller ?? '-'}
        </p>
      </div>


      <div className="flex flex-col gap-3">
        <h2 className="font-bold">
          محصولات
        </h2>

        {order.requested_products.map(
          (item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 p-4"
            >
              <strong>
                {item.course_title}
              </strong>

              <p>
                قیمت:{' '}
                {Number(
                  item.price,
                ).toLocaleString(
                  'fa-IR',
                )}
              </p>

              <p>
                تخفیف:{' '}
                {Number(
                  item.discount,
                ).toLocaleString(
                  'fa-IR',
                )}
              </p>

              <p>
                مبلغ نهایی:{' '}
                {Number(
                  item.final_price,
                ).toLocaleString(
                  'fa-IR',
                )}
              </p>
            </div>
          ),
        )}
      </div>


      {order.status ===
        'pending' && (
        <div className="flex gap-3">

          {canApprove && (
            <Button
              type="button"
              disabled={
                approveMutation
                  .isPending
              }
              onClick={() =>
                approveMutation
                  .mutate()
              }
            >
              تأیید سفارش
            </Button>
          )}

          {canReject && (
            <Button
              type="button"
              variant="danger"
              disabled={
                rejectMutation
                  .isPending
              }
              onClick={() =>
                rejectMutation
                  .mutate()
              }
            >
              رد سفارش
            </Button>
          )}

        </div>
      )}
    </div>
  )
}