'use client'

import TopMenu from '@/components/TopMenu/TopMenu'
import NavigationMenu from '@/components/NavigationMenu/NavigationMenu'
import Providers from '@/app/providers'
import DataInitializer from '@/components/DataInitializer'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DataInitializer />
      <div className="d-flex flex-column min-vh-100">
        <TopMenu />
        <div className="d-flex flex-grow-1">
          <NavigationMenu />
          <main className="flex-grow-1 p-4 bg-light">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  )
}

