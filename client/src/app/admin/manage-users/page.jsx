'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconUserCheck, 
  IconUserX,
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
  IconShieldCheck,
  IconShieldX
} from '@tabler/icons-react'

export default function ManageUsers() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  
  const fetchUsers = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing')
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      // Check if the current admin is a super admin
      setIsSuperAdmin(user.email === process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL)
      setUsers(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching users'
      setError(errorMessage)
      
      if (err.response?.status === 401 || errorMessage.includes('token')) {
        toast.error('Session expired. Please login again.')
        logout()
        router.replace('/login')
        return
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    fetchUsers()
  }, [user])

  const handleSearch = (e) => {
    e.preventDefault()
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setUsers(filteredUsers)
    if (searchTerm === '') {
      fetchUsers()
    }
  }

  const handleUpdateRole = async (userId, role) => {
    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing')
      }

      if (!isSuperAdmin) {
        toast.error('Only Super Admin can modify user roles')
        return
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      fetchUsers()
      toast.success(`User role updated to ${role}`)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating user role'
      toast.error(errorMessage)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing')
      }

      if (!isSuperAdmin) {
        toast.error('Only Super Admin can delete users')
        return
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      fetchUsers()
      toast.success('User deleted successfully')
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting user'
      toast.error(errorMessage)
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setSelectedUser(null)
    setIsEditModalOpen(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header and Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userData.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}>
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userData.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {isSuperAdmin && (
                        <>
                          {userData.role === 'user' ? (
                            <button
                              onClick={() => handleUpdateRole(userData._id, 'admin')}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-2"
                              title="Make Admin"
                            >
                              <IconShieldCheck size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateRole(userData._id, 'user')}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 ml-2"
                              title="Remove Admin"
                            >
                              <IconShieldX size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(userData._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                            title="Delete User"
                          >
                            <IconTrash size={20} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openEditModal(userData)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-2"
                        title="View Details"
                      >
                        <IconEdit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">User Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                  {selectedUser.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                  {selectedUser.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                  {selectedUser.username}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                  {selectedUser.role}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeEditModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}