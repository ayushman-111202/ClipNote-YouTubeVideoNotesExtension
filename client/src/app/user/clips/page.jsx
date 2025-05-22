'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  IconVideo, 
  IconTrash, 
  IconEdit, 
  IconPlayerPlay,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconAdjustments,
  IconPlaylist
} from '@tabler/icons-react'

export default function Clips() {
  const { user } = useAuth()
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedClip, setSelectedClip] = useState(null)
  const [filters, setFilters] = useState({
    sortBy: 'date',
    order: 'desc'
  })

  // Debug logging
  useEffect(() => {
    console.log('User object:', user)
    console.log('User ID:', user?._id || user?.id)
    console.log('User token:', user?.token ? 'Token exists' : 'No token')
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
  }, [user])

  const fetchClips = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if user and token exist
      if (!user) {
        setError('User not authenticated')
        return
      }

      if (!user.token) {
        setError('Authentication token missing')
        return
      }

      // Use _id if id doesn't exist (common in MongoDB)
      const userId = user._id || user.id
      if (!userId) {
        setError('User ID not found')
        return
      }

      console.log('Fetching clips for user:', userId)
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/clips/user/${userId}`)

      // Make API call with detailed logging
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clips/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('API Response:', response)
      console.log('Response data:', response.data)
      
      // Handle response format - clipRouter returns array directly
      if (Array.isArray(response.data)) {
        setClips(response.data)
        console.log('Clips loaded:', response.data.length)
      } else if (response.data && response.data.clips && Array.isArray(response.data.clips)) {
        // Handle if response has clips property
        setClips(response.data.clips)
        console.log('Clips loaded from clips property:', response.data.clips.length)
      } else {
        console.log('No clips data found in response')
        setClips([])
      }
      
      // Since backend doesn't support pagination yet, set defaults
      setTotalPages(1)
      setCurrentPage(1)
      setError(null)
      
    } catch (err) {
      console.error('Error fetching clips - Full error:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('Error response status:', err.response?.status)
      
      let errorMessage = 'Error fetching clips'
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.'
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.'
      } else if (err.response?.status === 404) {
        errorMessage = 'Clips endpoint not found. Please check your API configuration.'
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      setClips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Add delay to ensure user object is fully loaded
    const timeoutId = setTimeout(() => {
      if (user?.token && (user?._id || user?.id)) {
        fetchClips()
      } else if (user && !user.token) {
        setError('Please login to view your clips')
        setLoading(false)
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [user?.token, user?._id, user?.id])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchClips(1)
  }

  const handleDeleteClip = async (clipId) => {
    if (!window.confirm('Are you sure you want to delete this clip?')) {
      return
    }

    try {
      console.log('Deleting clip:', clipId)
      
      // Use the correct delete endpoint from clipRouter.js
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/clips/delete/${clipId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      // Refresh the clips list
      fetchClips(currentPage)
      toast.success('Clip deleted successfully')
    } catch (err) {
      console.error('Error deleting clip:', err)
      console.error('Delete error response:', err.response?.data)
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Error deleting clip'
      toast.error(errorMessage)
    }
  }

  const formatDuration = (start, end) => {
    try {
      const getSeconds = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
      
      const startSeconds = getSeconds(start);
      const endSeconds = getSeconds(end);
      const totalSeconds = endSeconds - startSeconds;

      const minutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting duration:', error)
      return '0:00'
    }
  }

  const convertTimeToSeconds = (timeStr) => {
    try {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    } catch (error) {
      console.error('Error converting time:', error)
      return 0
    }
  }

  // Filter clips based on search term if backend doesn't support it
  const filteredClips = clips.filter(clip => 
    searchTerm === '' || 
    clip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (clip.note && clip.note.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Debug render
  console.log('Render state:', { loading, error, clipsCount: clips.length, filteredCount: filteredClips.length })

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your clips...</p>
        {/* Debug info in loading state */}
        <div className="mt-4 text-xs text-gray-500">
          <p>User: {user ? 'Loaded' : 'Loading...'}</p>
          <p>Token: {user?.token ? 'Available' : 'Missing'}</p>
          <p>User ID: {user?._id || user?.id || 'Missing'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold mb-2">Error Loading Clips</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => fetchClips()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Try Again
          </button>
          <button 
            onClick={() => {
              setError(null)
              setLoading(false)
              setClips([])
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Continue Anyway
          </button>
          {/* Debug info in error state */}
          <div className="mt-4 text-xs text-gray-500 text-left">
            <p><strong>Debug Info:</strong></p>
            <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            <p>User ID: {user?._id || user?.id || 'Missing'}</p>
            <p>Has Token: {user?.token ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header and Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Clips</h1>
              {/* Debug info */}
              <p className="text-sm text-gray-500">
                {clips.length} total clips, {filteredClips.length} shown
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clips..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setFilters({ sortBy: 'createdAt', order: 'desc' })}
                className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <IconAdjustments className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Clips Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <IconVideo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {clips.length === 0 ? 'No clips found' : 'No clips match your search'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {clips.length === 0 
                  ? 'Start by creating your first clip!' 
                  : 'Try adjusting your search terms'
                }
              </p>
              {clips.length === 0 && (
                <button 
                  onClick={() => fetchClips()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh
                </button>
              )}
            </div>
          ) : (
            filteredClips.map((clip) => (
              <div
                key={clip._id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${clip.videoID}/mqdefault.jpg`}
                    alt={clip.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/320/180'
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
                    {formatDuration(clip.startTime, clip.endTime)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {clip.title}
                  </h3>
                  {clip.note && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {clip.note}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(clip.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={`https://youtube.com/watch?v=${clip.videoID}&t=${convertTimeToSeconds(clip.startTime)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <IconPlayerPlay className="h-5 w-5" />
                      <span>Watch</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedClip(clip)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Add to playlist"
                      >
                        <IconPlaylist className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClip(clip._id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete clip"
                      >
                        <IconTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - Currently disabled since backend doesn't support it */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => fetchClips(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              Previous
            </button>
            <button
              onClick={() => fetchClips(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{filteredClips.length}</span> clips
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => fetchClips(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => fetchClips(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <IconChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}