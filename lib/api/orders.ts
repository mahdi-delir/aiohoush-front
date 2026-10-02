import {
  apiFetch,
} from './client'

import type {
  CreateOrderInput,
  Order,
  OrderOptions,
} from '@/types/order'


export function getOrders() {
  return apiFetch<Order[]>(
    '/api/orders/',
  )
}


export function getOrderOptions() {
  return apiFetch<OrderOptions>(
    '/api/orders/options/',
  )
}


export function createOrder(
  input: CreateOrderInput,
) {
  return apiFetch<Order>(
    '/api/orders/',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export function getOrder(
  id: number,
) {
  return apiFetch<Order>(
    `/api/orders/${id}/`,
  )
}


export function approveOrder(
  id: number,
) {
  return apiFetch<undefined>(
    `/api/orders/${id}/approve/`,
    {
      method: 'POST',
    },
  )
}


export function rejectOrder(
  id: number,
) {
  return apiFetch<undefined>(
    `/api/orders/${id}/reject/`,
    {
      method: 'POST',
    },
  )
}