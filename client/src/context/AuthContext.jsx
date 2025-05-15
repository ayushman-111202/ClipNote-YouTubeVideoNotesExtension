'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [authError, setAuthError] = useState(null)
  const tokenIntervalRef = useRef(null)
  const isInitialCheckRef = useRef(true)

  const checkTokenExpiration = useCallback((token) => {
    if (!token) return true
    try {
      const decoded = jwtDecode(token)
      return decoded.exp * 1000 <= Date.now()
    } catch (error) {
      console.error('Token decode error:', error)
      return true
    }
  }, [])

  const startTokenExpirationCheck = useCallback((token) => {
    if (tokenIntervalRef.current) {
      clearInterval(tokenIntervalRef.current)
    }

    tokenIntervalRef.current = setInterval(() => {
      const currentToken = localStorage.getItem('token')
      if (!currentToken || checkTokenExpiration(currentToken)) {
        clearInterval(tokenIntervalRef.current)
        logout()
      }
    }, 60000) // Check every minute

    return () => {
      if (tokenIntervalRef.current) {
        clearInterval(tokenIntervalRef.current)
      }
    }
  }, [])

  const handleStorageChange = useCallback((e) => {
    if (e.key === 'token') {
      if (!e.newValue) {
        setUser(null)
        router.replace('/login')
      } else if (e.newValue !== user?.token) {
        restoreUserSession(true)
      }
    }
  }, [user])

  const restoreUserSession = useCallback(async (skipApiCheck = false) => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('userData')

      if (!token || checkTokenExpiration(token)) {
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        setUser(null)
        return false
      }

      // First try to restore from localStorage
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        setUser(parsedUserData)
        startTokenExpirationCheck(token)
      }

      // Skip API check if specified
      if (skipApiCheck) {
        return true
      }

      // Verify with server
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/verify-token`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (!response.data.valid) {
        throw new Error('Invalid token')
      }

      return true
    } catch (error) {
      console.error('Session restoration failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      setUser(null)
      return false
    }
  }, [checkTokenExpiration, startTokenExpirationCheck])

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isInitialCheckRef.current) return
      isInitialCheckRef.current = false

      const success = await restoreUserSession()
      if (!success) {
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
          router.replace('/login')
        }
      }
      setLoading(false)
    }

    initializeAuth()

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (tokenIntervalRef.current) {
        clearInterval(tokenIntervalRef.current)
      }
    }
  }, [restoreUserSession, handleStorageChange])

  const login = async (credentials) => {
    if (isRedirecting) return { success: false, error: 'Redirection in progress' }
    
    try {
      setLoading(true)
      setIsRedirecting(true)
      setAuthError(null)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`, 
        credentials
      )

      const { token } = response.data
      const decoded = jwtDecode(token)
      const userData = {
        ...decoded,
        token
      }

      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
      startTokenExpirationCheck(token)

      if (decoded.role === 'admin') {
        await router.replace('/admin/dashboard')
      } else {
        await router.replace('/user/dashboard')
      }
      
      toast.success('Login successful')
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      setAuthError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
      setIsRedirecting(false)
    }
  }

  const logout = useCallback(() => {
    if (tokenIntervalRef.current) {
      clearInterval(tokenIntervalRef.current)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUser(null)
    router.replace('/login')
  }, [router])

  const checkRole = useCallback((allowedRoles) => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }, [user])

  const value = {
    user,
    loading,
    login,
    logout,
    checkRole,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    isRedirecting,
    authError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
