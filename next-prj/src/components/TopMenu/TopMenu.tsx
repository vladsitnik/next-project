'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { useDayjsLocale } from '@/hooks/useDayjsLocale'
import styles from './TopMenu.module.css'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')

const TopMenu = () => {
  const [now, setNow] = useState(dayjs())
  const [activeSessions, setActiveSessions] = useState(1)
  const { t } = useTranslation()

  useDayjsLocale()

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000)

    socket.emit('new_session')
    socket.on('active_sessions', setActiveSessions)

    return () => {
      clearInterval(interval)
      socket.off('active_sessions', setActiveSessions)
    }
  }, [])

  return (
    <header className="bg-white shadow position-relative z-3 py-2">
      <div className="container-xl d-flex align-items-center justify-content-between px-4 px-sm-5 px-lg-0">
        <div className="d-flex align-items-center">
          <i className="bi bi-shield-shaded text-success fs-4 me-2"></i>
          <span className="fw-bold text-success">INVENTORY</span>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center">
          <input
            type="text"
            autoComplete="off"
            className={`form-control form-control-sm ${styles.searchInput}`}
            placeholder={t('search')}
          />
        </div>

        <div className="d-flex align-items-center gap-4 text-muted small text-start">
          <div className={styles.dateBlock}>
            <div className="fw-medium text-capitalize">{now.format('dddd')}</div>
            <div className="d-flex align-items-center gap-2">
              <span>{now.format('DD MMM, YYYY')}</span>
              <span>
                <i className="bi bi-clock text-success me-1"></i>
                {now.format('HH:mm')}
              </span>
            </div>
          </div>
          <div className={styles.sessionBlock}>
            <i className="bi bi-person-fill text-warning me-1"></i>
            {t('activeSessions')}: <strong>{activeSessions}</strong>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopMenu