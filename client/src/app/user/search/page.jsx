'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  IconVideo,
  IconPlaylist,
  IconSearch,
  IconAdjustments,
  IconPlus,
  IconPlayerPlay,
  IconChevronLeft,
  IconChevronRight,
  IconUser
} from '@tabler/icons-react'

export default function Search() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('clips') // 'clips' or 'playlists'
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [userPlaylists, setUserPlaylists] = useState([])
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    order: 'desc'
  })

  // Debug logging
  useEffect(() => {
    console.log('Search - User object:', user)
    fetchUserPlaylists()
  }, [user])

  const fetchUserPlaylists = async () => {
    if (!user?.token || !user?.id && !user?._id) return
    
    try {
      const userId = user._id || user.id
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          params: { limit: 100 } // Get all playlists for dropdown
        }
      )
      
      const playlists = response.data.playlists || response.data
      setUserPlaylists(Array.isArray(playlists) ? playlists : [])
    } catch (err) {
      console.error('Error fetching user playlists:', err)
    }
  }

  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      setResults([])
      setTotalResults(0)
      setTotalPages(1)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log('Performing search:', { searchTerm, searchType, page })
      
      if (searchType === 'clips') {
        // Search in user's clips using the clips/user endpoint with client-side filtering
        const userId = user._id || user.id
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/clips/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        )
        
        // Client-side filtering since backend doesn't have search yet
        const allClips = Array.isArray(response.data) ? response.data : []
        const filteredClips = allClips.filter(clip => 
          clip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (clip.note && clip.note.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        
        // Sort results
        const sortedClips = filteredClips.sort((a, b) => {
          if (filters.sortBy === 'createdAt') {
            return filters.order === 'desc' 
              ? new Date(b.createdAt) - new Date(a.createdAt)
              : new Date(a.createdAt) - new Date(b.createdAt)
          }
          return 0
        })
        
        setResults(sortedClips)
        setTotalResults(sortedClips.length)
        setTotalPages(1) // No pagination for now
        setCurrentPage(1)
        
      } else {
        // Search in user's playlists
        const userId = user._id || user.id
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            },
            params: {
              search: searchTerm,
              sortBy: filters.sortBy,
              order: filters.order,
              page,
              limit: 12
            }
          }
        )
        
        console.log('Playlists search response:', response.data)
        
        const playlists = response.data.playlists || response.data
        setResults(Array.isArray(playlists) ? playlists : [])
        setTotalResults(response.data.total || (Array.isArray(playlists) ? playlists.length : 0))
        setTotalPages(response.data.totalPages || 1)
        setCurrentPage(response.data.currentPage || 1)
      }
      
    } catch (err) {
      console.error('Search error:', err)
      console.error('Search error response:', err.response?.data)
      
      let errorMessage = 'Error performing search'
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.'
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(1)
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
      return '0:00'
    }
  }

  const convertTimeToSeconds = (timeStr) => {
    try {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    } catch (error) {
      return 0
    }
  }

  const addToPlaylist = async (clipId, playlistId) => {
    try {
      // Move clip to playlist using the clips/move endpoint
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/clips/move/${clipId}`,
        { playlistId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      toast.success('Clip added to playlist successfully')
    } catch (err) {
      console.error('Error adding to playlist:', err)
      toast.error(err.response?.data?.error || 'Error adding clip to playlist')
    }
  }

  const AddToPlaylistDropdown = ({ clipId }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          title="Add to playlist"
        >
          <IconPlus className="h-5 w-5" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
            <div className="py-1">
              {userPlaylists.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No playlists available
                </div>
              ) : (
                userPlaylists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => {
                      addToPlaylist(clipId, playlist._id)
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {playlist.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
        
        {isOpen && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for clips or playlists..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <IconSearch className="h-5 w-5" />
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchType('clips')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      searchType === 'clips'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <IconVideo className="h-5 w-5" />
                    Clips
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('playlists')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      searchType === 'playlists'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <IconPlaylist className="h-5 w-5" />
                    Playlists
                  </button>
                </div>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="updatedAt">Sort by Last Updated</option>
                  {searchType === 'playlists' && <option value="name">Sort by Name</option>}
                </select>

                <select
                  value={filters.order}
                  onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-lg bg-red-50 max-w-md mx-auto">
                <h3 className="font-semibold mb-2">Search Error</h3>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => handleSearch(currentPage)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {searchTerm && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalResults > 0 
                      ? `Found ${totalResults} ${searchType} matching "${searchTerm}"`
                      : `No ${searchType} found matching "${searchTerm}"`
                    }
                  </p>
                </div>
              )}

              {results.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    {searchType === 'clips' ? (
                      <IconVideo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    ) : (
                      <IconPlaylist className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No {searchType} found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try different search terms or check your spelling
                  </p>
                  <div className="text-sm text-gray-400">
                    <p>Search tips:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Use specific keywords from titles or descriptions</li>
                      <li>• Try shorter search terms</li>
                      <li>• Check different sort options</li>
                    </ul>
                  </div>
                </div>
              ) : results.length === 0 && !searchTerm ? (
                <div className="text-center py-12">
                  <IconSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Start Searching
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter a search term to find your clips and playlists
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchType === 'clips'
                    ? results.map((clip) => (
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
                              <AddToPlaylistDropdown clipId={clip._id} />
                            </div>
                          </div>
                        </div>
                      ))
                    : results.map((playlist) => (
                        <div
                          key={playlist._id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                                <IconPlaylist className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {playlist.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {playlist.clips?.length || 0} clips
                                </p>
                              </div>
                            </div>
                            {playlist.description && (
                              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {playlist.description}
                              </p>
                            )}
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <IconVideo className="h-4 w-4" />
                                <span>Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
                              </div>
                              <a
                                href={`/user/playlists/${playlist._id}`}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                              >
                                View →
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}

              {/* Pagination */}
              {results.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handleSearch(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleSearch(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handleSearch(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        >
                          <IconChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleSearch(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        >
                          <IconChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}