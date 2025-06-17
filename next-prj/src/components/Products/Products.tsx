'use client'

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { RootState } from '@/store/store'
import { Product } from '@/types'
import { removeProduct } from '@/store/productsSlice'
import { useDayjsLocale } from '@/hooks/useDayjsLocale'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'

const Products = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const products = useSelector((state: RootState) => state.products.list)
  const orders = useSelector((state: RootState) => state.orders.list)

  const locale = useDayjsLocale()

  const [selectedType, setSelectedType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const productTypes = useMemo(() => [...new Set(products.map((p) => p.type))], [products])

  const filteredProducts = useMemo(() =>
    selectedType === 'all'
      ? products
      : products.filter((p) => p.type === selectedType),
    [selectedType, products]
  )

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
    } finally {
      setShowModal(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="p-4 bg-light min-vh-100">
      <h4 className="mb-3 fw-bold">
        {t('products')} / {filteredProducts.length}
      </h4>

      <div className="mb-4">
        <label className="form-label">{t('filterByType')}:</label>
        <select
          className="form-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">{t('all')}</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {filteredProducts.map((product) => {
        const order = orders.find((o) => o.id === product.order)

        return (
          <div
            key={product.id}
            className="d-flex align-items-center justify-content-between border rounded px-3 py-2 shadow-sm mb-2 bg-white"
          >
            <div className="d-flex align-items-center gap-3" style={{ width: '30%' }}>
              <span className="rounded-circle d-inline-block" style={{ width: 10, height: 10, backgroundColor: 'green' }} />
              <i className="bi bi-display fs-4 text-muted" />
              <div className="small">
                <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: 180 }}>
                  {product.title}
                </div>
                <div className="text-muted small">SN: {product.serialNumber}</div>
              </div>
            </div>

            <div className="text-success fw-semibold small">{t('statusFree')}</div>

            <div className="text-muted small text-center">
              <div>{t('from')} {dayjs(product.guarantee.start).format('DD / MM / YYYY')}</div>
              <div>{t('to')} {dayjs(product.guarantee.end).format('DD / MM / YYYY')}</div>
            </div>

            <div className="text-muted small">{t('new')}</div>

            <div className="text-muted small text-end">
              {product.price.map((p) => (
                <div key={p.symbol}>
                  {p.value.toLocaleString()} {p.symbol}
                </div>
              ))}
            </div>

            <div className="text-muted small">—</div>

            <div className="text-end small" style={{ maxWidth: 200 }}>
              <div className="text-secondary text-decoration-underline text-truncate">
                {order?.title || t('notFound')}
              </div>
              <div className="text-muted">
                {order ? dayjs(order.date).locale(locale).format('DD / MMM / YYYY') : '—'}
              </div>
            </div>

            <i
              className="bi bi-trash text-muted"
              role="button"
              aria-label={t('delete')}
              onClick={() => {
                setProductToDelete(product)
                setShowModal(true)
              }}
            />
          </div>
        )
      })}

      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        product={productToDelete || undefined}
      />
    </div>
  )
}

export default Products