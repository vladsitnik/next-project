'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setOrders } from '@/store/ordersSlice'
import { setProducts } from '@/store/productsSlice'

const DataInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products'),
        ])

        const [orders, products] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
        ])

        dispatch(setOrders(orders))
        dispatch(setProducts(products))
      } catch {
        alert('Ошибка загрузки данных')
      }
    })()
  }, [dispatch])

  return null
}

export default DataInitializer