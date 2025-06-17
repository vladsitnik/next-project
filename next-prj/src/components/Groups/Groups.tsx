'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'

import { RootState } from '@/store/store'
import {  Product } from '@/types'
import { selectOrder, clearSelectedOrder } from '@/store/ordersSlice'
import { removeProduct } from '@/store/productsSlice'
import { useDayjsLocale } from '@/hooks/useDayjsLocale'

import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import styles from './Groups.module.css'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const Groups = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const orders = useSelector((state: RootState) => state.orders.list)
  const products = useSelector((state: RootState) => state.products.list)
  const selectedOrderId = useSelector((state: RootState) => state.orders.selectedOrderId)

  const locale = useDayjsLocale()
  const selectedOrder = orders.find((o) => o.id === selectedOrderId)
  const relatedProducts = products.filter((p) => p.order === selectedOrderId)

  const [showModal, setShowModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productToDelete.id }),
      })

      if (res.ok) {
        dispatch(removeProduct(productToDelete.id))
      }
    } catch {
      //
    } finally {
      setShowModal(false)
      setProductToDelete(null)
    }
  }

  const handleSelect = (id: number) => dispatch(selectOrder(id))

  const getTotal = (orderId: number, currency: string) =>
    products.reduce(
      (sum, p) =>
        p.order === orderId ? sum + (p.price.find((x) => x.symbol === currency)?.value || 0) : sum,
      0
    )

  return (
    <div className="px-4 py-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-plus-circle-fill text-success me-2 fs-4" />
        <h5 className="m-0">
          {t('orders')} / {orders.length}
        </h5>
      </div>

      <div className="d-flex gap-4">
        <div className="flex-grow-1" style={{ maxWidth: '1300px' }}>
          {orders.map((order) => {
            const productCount = products.filter((p) => p.order === order.id).length
            const usd = getTotal(order.id, 'USD')
            const uah = getTotal(order.id, 'UAH')

            return (
              <div
                key={order.id}
                className={`d-flex align-items-center justify-content-between px-3 py-3 mb-3 ${styles.orderCard} ${
                  selectedOrderId === order.id ? 'border-success border-2' : 'border-light'
                }`}
                onClick={() => handleSelect(order.id)}
              >
                <div className="d-flex align-items-center flex-grow-1 gap-4">
                  <div className="d-flex align-items-center text-muted small" style={{ minWidth: '110px' }}>
                    <div className={styles.circleIcon}>
                      <i className="bi bi-list-task text-secondary" />
                    </div>
                    <div className="text-start ms-2">
                      <div className="fs-6">{productCount}</div>
                      <div className="small">{t('productsCount')}</div>
                    </div>
                  </div>

                  <div className="text-muted small text-center" style={{ width: '25%' }}>
                    <div className={styles.smallDate}>
                      {dayjs(order.date).locale(locale).format('DD / MM')}
                    </div>
                    <div className={styles.mediumDate}>
                      {dayjs(order.date)
                        .locale(locale)
                        .format('DD / MMM / YYYY')
                        .replace(/^./, (s) => s.toUpperCase())}
                    </div>
                  </div>

                  <div className="text-muted small text-start">
                    <div className={styles.mediumDate}>{usd.toLocaleString()} $</div>
                    <div>{uah.toLocaleString()} UAH</div>
                  </div>
                </div>

                {selectedOrderId === order.id && <div className={styles.selectedArrow} />}
              </div>
            )
          })}
        </div>

        {selectedOrder && (
          <div className="flex-grow-1">
            <div className={`card rounded-3 shadow bg-white position-relative p-4 ${styles.detailCard}`}>
              <button
                className={`btn btn-light rounded-circle position-absolute d-flex align-items-center justify-content-center ${styles.closeButton}`}
                onClick={() => dispatch(clearSelectedOrder())}
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>

              <h5 className="fw-bold mb-2">{selectedOrder.title}</h5>

              <button className="btn btn-link text-success d-flex align-items-center mb-3 p-0">
                <i className="bi bi-plus-circle me-2" /> {t('addProduct')}
              </button>

              {relatedProducts.length === 0 ? (
                <div className="text-muted">{t('noProductsInOrder')}</div>
              ) : (
                <ul className="list-group">
                  {relatedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="list-group-item d-flex align-items-center justify-content-between py-3"
                    >
                      <div className="d-flex align-items-center gap-3" style={{ width: '35%' }}>
                        <span className={styles.statusDot}></span>
                        <i className="bi bi-display fs-5 text-muted" />
                        <div className="d-flex flex-column">
                          <span className="fw-semibold text-decoration-underline">{product.title}</span>
                          <small className="text-muted">С/Н: {product.serialNumber}</small>
                        </div>
                      </div>

                      <div className="text-success fw-semibold small" style={{ width: '10%' }}>
                        {t('statusFree')}
                      </div>

                      <i
                        className="bi bi-trash text-muted"
                        role="button"
                        onClick={() => {
                          setProductToDelete(product)
                          setShowModal(true)
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <MapView />
      </div>

      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        product={productToDelete || undefined}
      />
    </div>
  )
}

export default Groups