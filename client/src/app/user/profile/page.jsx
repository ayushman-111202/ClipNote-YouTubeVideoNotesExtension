'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  IconUser,
  IconMail,
  IconLock,
  IconEdit,
  IconCheck,
  IconX
} from '@tabler/icons-react'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    contact: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [stats, setStats] = useState({
    totalClips: 0,
    totalPlaylists: 0,
    joinedDate: null
  })

  // Debug logging
  useEffect(() => {
    console.log('Profile - User object:', user)
    console.log('Profile - User ID:', user?._id || user?.id)
    console.log('Profile - User token:', user?.token ? 'Token exists' : 'No token')
  }, [user])

  useEffect(() => {
    if (user?.token) {
      fetchUserProfile()
    }
  }, [user?.token])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching user profile...')
      
      // Use the correct profile endpoint from userRouter.js
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('Profile API Response:', response.data)
      
      const userData = response.data
      setProfileData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        username: userData.username || '',
        bio: userData.bio || '',
        contact: userData.contact || '',
        // Keep password fields empty
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      // Set joined date from timestamps
      const joinedDate = userData.createdAt || userData.timestamps?.createdAt
      setStats(prev => ({
        ...prev,
        joinedDate: joinedDate ? new Date(joinedDate) : null
      }))
      
      // Fetch additional stats
      await fetchUserStats()
      
    } catch (err) {
      console.error('Error fetching profile:', err)
      console.error('Profile error response:', err.response?.data)
      
      let errorMessage = 'Error fetching profile'
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const userId = user._id || user.id
      console.log('Fetching user stats for:', userId)
      
      // Fetch clips count
      const clipsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clips/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      // Fetch playlists count using the correct endpoint
      const playlistsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          params: { limit: 1 } // Just get count, not all data
        }
      )

      console.log('Clips response:', clipsResponse.data)
      console.log('Playlists response:', playlistsResponse.data)

      const clipsCount = Array.isArray(clipsResponse.data) ? clipsResponse.data.length : 0
      const playlistsCount = playlistsResponse.data.total || 
                            (playlistsResponse.data.playlists ? playlistsResponse.data.playlists.length : 0)

      setStats(prev => ({
        ...prev,
        totalClips: clipsCount,
        totalPlaylists: playlistsCount
      }))
      
      console.log('Stats updated:', { totalClips: clipsCount, totalPlaylists: playlistsCount })

    } catch (err) {
      console.error('Error fetching user stats:', err)
      // Don't show error for stats, just log it
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!profileData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    if (!profileData.email.trim()) {
      toast.error('Email is required')
      return
    }

    // Validate passwords if changing password
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        toast.error('Current password is required to change password')
        return
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
      if (profileData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long')
        return
      }
    }

    try {
      setUpdating(true)
      
      // Prepare basic profile update data
      const updateData = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        bio: profileData.bio.trim(),
        contact: profileData.contact.trim()
      }

      console.log('Updating profile with data:', updateData)

      // Update basic profile info
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Profile update response:', response.data)

      // Update password separately if provided
      if (profileData.newPassword) {
        console.log('Updating password...')
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
          {
            currentPassword: profileData.currentPassword,
            newPassword: profileData.newPassword
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log('Password updated successfully')
      }

      // Update user context with new data
      updateUser({
        ...user,
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
        contact: response.data.contact
      })

      // Reset editing state and clear password fields
      setIsEditing(false)
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      toast.success('Profile updated successfully')
      
    } catch (err) {
      console.error('Error updating profile:', err)
      console.error('Update error response:', err.response?.data)
      
      let errorMessage = 'Error updating profile'
      if (err.response?.status === 401) {
        errorMessage = 'Current password is incorrect'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      }
      
      toast.error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    setProfileData(prev => ({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      bio: user?.bio || '',
      contact: user?.contact || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold mb-2">Error Loading Profile</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchUserProfile} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
              >
                <IconEdit size={20} />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-2"
              >
                <IconX size={20} />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Username Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    disabled={true}
                    className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    name="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full py-2 px-3 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Contact Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="contact"
                    value={profileData.contact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full py-2 px-3 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your contact information"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password (Optional)
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          value={profileData.currentPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          value={profileData.newPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updating}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <IconCheck className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Statistics Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Clips</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalClips}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Playlists</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPlaylists}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.joinedDate ? stats.joinedDate.toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}