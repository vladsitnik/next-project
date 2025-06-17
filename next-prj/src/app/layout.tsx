import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Providers from './providers'

export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
