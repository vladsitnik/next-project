'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

import { RootState } from '@/store/store'
import eventBus from '@/utils/eventBus'

const OrdersChart = () => {
  const orders = useSelector((state: RootState) => state.orders.list)
  const products = useSelector((state: RootState) => state.products.list)

  const [excludedIds, setExcludedIds] = useState<number[]>([])

  useEffect(() => {
    const onDelete = ({ id }: { id: number }) => {
      setExcludedIds((prev) => [...prev, id])
    }

    eventBus.on('order:deleted', onDelete)
    return () => eventBus.off('order:deleted', onDelete)
  }, [])

  const data = useMemo(() => {
    return orders
      .filter(order => !excludedIds.includes(order.id))
      .map(order => ({
        name: order.title,
        total: products
          .filter(p => p.order === order.id)
          .reduce((sum, p) => sum + (p.price.find(x => x.symbol === 'USD')?.value || 0), 0),
      }))
  }, [orders, products, excludedIds])

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#28a745" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OrdersChart