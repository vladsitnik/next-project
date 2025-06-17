'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'

import { removeOrder } from '@/store/ordersSlice'
import { RootState } from '@/store/store'
import { Order, Product } from '@/types'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDayjsLocale } from '@/hooks/useDayjsLocale'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import eventBus from '@/utils/eventBus'

import styles from './Orders.module.css'

const OrdersChart = dynamic(() => import('@/components/Orders/OrdersChart'), {
  ssr: false,
  loading: () => <p>...</p>,
})

const Orders = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const orders = useSelector((state: RootState) => state.orders.list)
  const products = useSelector((state: RootState) => state.products.list)

  const [showModal, setShowModal] = useState(false)
  const [showChart, setShowChart] = useLocalStorage('showChart', false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [totals, setTotals] = useState<Record<string, number>>({})

  const locale = useDayjsLocale()

  const confirmDelete = async () => {
    if (!orderToDelete) return

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderToDelete.id }),
      })

      if (res.ok) {
        dispatch(removeOrder(orderToDelete.id))
        eventBus.emit('order:deleted', { id: orderToDelete.id })
      }
    } finally {
      setShowModal(false)
      setOrderToDelete(null)
    }
  }

  const calculateTotalWithWorker = (orderId: number, currency: string, products: Product[]) =>
    new Promise<number>((resolve) => {
      const worker = new Worker('/workers/totalWorker.js')
      worker.postMessage({ orderId, currency, products })
      worker.onmessage = (e) => {
        resolve(e.data.total)
        worker.terminate()
      }
    })

  useEffect(() => {
    const fetchTotals = async () => {
      const promises = orders.flatMap((order) => [
        calculateTotalWithWorker(order.id, 'USD', products).then((usd) => [`${order.id}_USD`, usd]),
        calculateTotalWithWorker(order.id, 'UAH', products).then((uah) => [`${order.id}_UAH`, uah]),
      ])

      const results = await Promise.all(promises)
      setTotals(Object.fromEntries(results))
    }

    fetchTotals()
  }, [orders, products])

  return (
    <div className="px-4 py-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-plus-circle-fill text-success me-2 fs-4" />
        <h5 className="m-0">
          {t('orders')} / {orders.length}
        </h5>
      </div>

      <div className="mb-3">
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => setShowChart((prev) => !prev)}
        >
          {showChart ? t('hideChart') : t('showChart')}
        </button>
      </div>

      {showChart && (
        <div className="mb-4">
          <OrdersChart />
        </div>
      )}

      <div className="d-flex gap-4">
        <div className={styles.ordersContainer}>
          {orders.map((order) => {
            const productCount = products.filter((p) => p.order === order.id).length
            const usd = totals[`${order.id}_USD`] ?? 0
            const uah = totals[`${order.id}_UAH`] ?? 0

            return (
              <div
                key={order.id}
                className={`border rounded d-flex align-items-center justify-content-between px-3 py-3 mb-3 border-light ${styles.orderCard}`}
              >
                <div className="d-flex align-items-center flex-grow-1 gap-4">
                  <div className={`fw-semibold text-decoration-underline text-muted ${styles.title}`}>
                    {order.title}
                  </div>

                  <div className={`d-flex align-items-center text-muted small ${styles.productCount}`}>
                    <div className={styles.productIconBox}>
                      <i className="bi bi-list-task text-secondary" />
                    </div>
                    <div className="text-start ms-2">
                      <div className="fs-6">{productCount}</div>
                      <div className="small">{t('productsCount')}</div>
                    </div>
                  </div>

                  <div className={`text-muted small text-center ${styles.dateBox}`}>
                    <div className={styles.dateShort}>
                      {order.date && dayjs(order.date).locale(locale).format('DD / MM')}
                    </div>
                    <div className={styles.dateFull}>
                      {order.date && dayjs(order.date).locale(locale).format('DD / MMM / YYYY')}
                    </div>
                  </div>

                  <div className="text-muted small text-start">
                    <div className={styles.currencyLine}>{usd.toLocaleString()} $</div>
                    <div>{uah.toLocaleString()} UAH</div>
                  </div>
                </div>

                <i
                  className="bi bi-trash text-muted"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOrderToDelete(order)
                    setShowModal(true)
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        product={
          orderToDelete
            ? products.find((p) => p.order === orderToDelete.id)
            : undefined
        }
      />
    </div>
  )
}

export default Orders