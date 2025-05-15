'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { IconUsers, IconUserCheck, IconUserPlus, IconChartBar, IconCalendarStats, IconFileAnalytics } from '@tabler/icons-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    recentUsers: [],
    adminInfo: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!user?.token) return;
      
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        setStats(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching admin statistics:', err)
        const errorMessage = err.response?.data?.message || 'Error fetching admin statistics'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminStats()
  }, [user?.token])

  const isSuperAdmin = stats.adminInfo?.email === process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {stats.adminInfo?.name}</h1>
            <p className="mt-1">
              {isSuperAdmin ? 'Super Admin' : 'Admin'} • {stats.adminInfo?.email}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="/admin/manage-users" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
              Manage Users
            </Link>
            {isSuperAdmin && (
              <Link href="/admin/register-admin" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
                Register Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <IconUsers className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Users</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <IconUserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Admin Users</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalAdmins}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <IconFileAnalytics className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Admin Controls</dt>
                <dd className="mt-2">
                  <Link href="/admin/manage-feedback" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    View Feedback →
                  </Link>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Users</h2>
          <Link 
            href="/admin/manage-users"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All Users
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentUsers?.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!stats.recentUsers || stats.recentUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent users found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Admin Controls */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Super Admin Controls</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={async () => {
                try {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/update-all-roles`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${user.token}`
                      }
                    }
                  );
                  toast.success('All user roles reset successfully');
                } catch (err) {
                  toast.error('Failed to reset user roles');
                }
              }}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset All User Roles
            </button>
          </div>
        </div>
      )}
    </div>
  )
}