'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import styles from './NavigationMenu.module.css'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const navLinks = [
  { to: '/orders', key: 'navOrders' },
  { to: '/groups', key: 'navGroups' },
  { to: '/products', key: 'navProducts' },
  { to: '/users', key: 'navUsers' },
  { to: '/settings', key: 'navSettings' },
]

const NavigationMenu = () => {
  const { t, i18n } = useTranslation()
  const pathname = usePathname()
  const [lang, setLang] = useLocalStorage<string>('language', i18n.language || 'ru')

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang, i18n])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    setLang(newLang)
  }

  return (
    <nav className={`d-flex flex-column p-3 bg-white shadow position-relative z-1 ${styles.sidebar}`}>
      <div className="mb-4 text-center position-relative">
        <div className={styles.avatarWrapper}>
          <i className={`bi bi-person-circle ${styles.avatarIcon}`}></i>
          <Link href="/settings" className={styles.gearLink}>
            <i className={`bi bi-gear-fill ${styles.gearIcon}`}></i>
          </Link>
        </div>
      </div>

      <div className="w-100 px-2">
        {navLinks.map(({ to, key }) => (
          <div key={to} className="text-center mb-2">
            <Link
              href={to}
              className={`${styles.link} ${pathname === to ? styles.linkActive : ''}`}
            >
              {t(key)}
            </Link>
          </div>
        ))}
      </div>

      <div className="px-2 pt-4 border-top mt-auto">
        <div className="form-check form-switch d-flex align-items-center justify-content-between">
          <input
            className={`form-check-input ${styles.switchCustom}`}
            type="checkbox"
            role="switch"
            id="langSwitchNav"
            checked={lang === 'en'}
            onChange={toggleLanguage}
          />
          <label className="form-check-label small" htmlFor="langSwitchNav">
            {lang.toUpperCase()}
          </label>
        </div>
        <button
          className="btn btn-outline-success btn-sm w-100 mt-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <i className="bi bi-box-arrow-right me-2"></i> {t('logout')}
        </button>
      </div>
    </nav>
  )
}

export default NavigationMenu