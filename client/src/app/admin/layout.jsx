'use client'
import RequireAuth from '@/components/RequireAuth'

export default function AdminLayout({ children }) {
  return (
    <RequireAuth requiredRole="admin">
      {children}
    </RequireAuth>
  )
}