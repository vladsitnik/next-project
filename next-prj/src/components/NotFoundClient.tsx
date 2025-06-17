'use client'

import { useTranslation } from 'react-i18next'

const NotFoundClient = () => {
  const { t } = useTranslation()

  return (
    <div className="container text-center py-5">
      <h1 className="display-4">404</h1>
      <p className="lead">{t('notFoundPage')}</p>
    </div>
  )
}

export default NotFoundClient