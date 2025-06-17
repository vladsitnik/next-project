'use client'

import { Product } from '@/types'
import { useTranslation } from 'react-i18next'

interface ConfirmDeleteModalProps {
  show: boolean
  onClose: () => void
  onConfirm: () => void
  product?: Product
}

const ConfirmDeleteModal = ({
  show,
  onClose,
  onConfirm,
  product,
}: ConfirmDeleteModalProps) => {
  const { t } = useTranslation()

  if (!show) return null

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
      style={{ zIndex: 1050 }}
    >
      <div
        className="bg-white rounded shadow position-relative overflow-visible"
        style={{ width: 540 }}
      >
        <button
          className="btn btn-light rounded-circle position-absolute d-flex align-items-center justify-content-center"
          onClick={onClose}
          style={{
            top: -16,
            right: -16,
            width: 36,
            height: 36,
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <i className="bi bi-x-lg" />
        </button>

        <div className="p-4">
          <h5 className="fw-bold">{t('confirmDeleteTitle')}</h5>

          {product && (
            <div className="d-flex align-items-center gap-3 border rounded p-3 mt-4">
              <span
                className="bg-success d-inline-block"
                style={{ width: 10, height: 10 }}
              />
              <i className="bi bi-display fs-4 text-muted" />
              <div className="small">
                <div className="fw-semibold text-dark">{product.title}</div>
                <div className="text-primary small text-decoration-underline">
                  С/Н: {product.serialNumber}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="bg-success px-4 py-3 d-flex justify-content-end gap-3"
          style={{
            borderTop: '1px solid #dee2e6',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <button
            className="btn btn-link text-white fw-semibold text-uppercase"
            onClick={onClose}
            style={{ textDecoration: 'none' }}
          >
            {t('cancel')}
          </button>
          <button
            className="btn btn-light fw-semibold px-4 py-2"
            onClick={onConfirm}
          >
            <i className="bi bi-trash text-danger me-1" />
            <span className="text-danger">{t('delete')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal