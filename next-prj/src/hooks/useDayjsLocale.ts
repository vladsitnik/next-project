import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/ru'
import 'dayjs/locale/en'

dayjs.extend(localizedFormat)

export const useDayjsLocale = (): string => {
  const { i18n } = useTranslation()
  const locale = ['en', 'ru'].includes(i18n.language) ? i18n.language : 'ru'

  useEffect(() => {
    dayjs.locale(locale)
  }, [locale])

  return locale
}
