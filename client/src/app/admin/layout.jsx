import React from 'react'
// import AdminNavbar from './Navbar';
import { AuthProvider } from '@/context/AuthContext';

const Layout = ({ children }) => {
  return (
    <>
        <AuthProvider>
        {children}
        </AuthProvider>
    </>
  )
}

export default Layout;