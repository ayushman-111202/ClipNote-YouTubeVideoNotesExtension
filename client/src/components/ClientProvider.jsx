'use client'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ClientProvider({ children }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      {pathname !== '/login' && pathname !== '/signup' && <Navbar />}
      <div className={pathname !== '/login' && pathname !== '/signup' ? 'pt-16' : ''}>
        {children}
      </div>
    </AuthProvider>
  )
}