'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  approveOrder,
  createOrder,
  getOrder,
  getOrderOptions,
  getOrders,
  rejectOrder,
} from '@/lib/api/orders'


export const ordersQueryKey = [
  'orders',
] as const


export function useOrders() {
  return useQuery({
    queryKey: ordersQueryKey,

    queryFn: async () => {
      const response =
        await getOrders()

      return response.data ?? []
    },
  })
}


export function useOrderOptions() {
  return useQuery({
    queryKey: [
      'orders',
      'options',
    ],

    queryFn: async () => {
      const response =
        await getOrderOptions()

      if (!response.data) {
        throw new Error(
          'Order options missing',
        )
      }

      return response.data
    },
  })
}


export function useCreateOrder() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: createOrder,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ordersQueryKey,
      })
    },
  })
}

export function useOrder(
  id: number,
) {
  return useQuery({
    queryKey: [
      'orders',
      id,
    ],

    queryFn: async () => {
      const response =
        await getOrder(id)

      if (!response.data) {
        throw new Error(
          'Order data missing',
        )
      }

      return response.data
    },

    enabled:
      Number.isFinite(id) &&
      id > 0,
  })
}


export function useApproveOrder(
  id: number,
) {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: () =>
      approveOrder(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'orders',
            id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey:
            ordersQueryKey,
        }),
      ])
    },
  })
}


export function useRejectOrder(
  id: number,
) {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: () =>
      rejectOrder(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'orders',
            id,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey:
            ordersQueryKey,
        }),
      ])
    },
  })
}