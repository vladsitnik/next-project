import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProtectedLayout from '@/components/ProtectedLayout'

export default async function AuthLayout({children,}: {children: React.ReactNode}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <html lang="ru">
      <body>
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  )
}
