'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import {
  IconHome,
  IconVideo,
  IconPlaylist,
  IconSearch,
  IconUser,
  IconLogout,
  IconMenu2,
  IconX,
  IconLayoutDashboard,
  IconUsers,
  IconUserPlus,
  IconMessageUser
} from '@tabler/icons-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const userNavigation = [
    { name: 'Dashboard', href: '/user/dashboard', icon: IconHome },
    { name: 'My Clips', href: '/user/clips', icon: IconVideo },
    { name: 'My Playlists', href: '/user/playlists', icon: IconPlaylist },
    { name: 'Search', href: '/user/search', icon: IconSearch },
    { name: 'Feedback', href: '/user/feedback', icon: IconMessageUser },
    { name: 'Profile', href: '/user/profile', icon: IconUser },
  ]

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: IconLayoutDashboard },
    { name: 'Manage Users', href: '/admin/manage-users', icon: IconUsers },
    { name: 'Register Admin', href: '/admin/register-admin', icon: IconUserPlus },
  ]

  const publicNavigation = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/guide', label: 'Guide' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => pathname === path

  const renderNavLinks = () => {
    if (!user) return publicNavigation
    return user.role === 'admin' ? adminNavigation : userNavigation
  }

  const currentNavigation = renderNavLinks()

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <IconX className="w-6 h-6" />
              ) : (
                <IconMenu2 className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center ml-2">
              <img
                src="/logo_clipnote.png"
                className="h-8 w-auto mr-3"
                alt="ClipNote Logo"
              />
              <span className="self-center text-xl font-semibold text-gray-900 dark:text-white">
                {user?.role === 'admin' ? 'Admin Panel' : 'ClipNote'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && currentNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-2" />}
                  {item.name}
                </Link>
              )
            })}
            {!user && currentNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <ThemeToggle />
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                <IconLogout className="w-5 h-5 mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {Icon && <Icon className="w-6 h-6 mr-2" />}
                  {item.name || item.label}
                </Link>
              )
            })}
            <div className="pt-4 flex items-center space-x-4 px-3">
              <ThemeToggle />
              {user && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    logout()
                  }}
                  className="flex items-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-base font-medium w-full"
                >
                  <IconLogout className="w-6 h-6 mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}