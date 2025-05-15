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
  IconChevronRight
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
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    duration: 'any',
    dateRange: 'any'
  })

  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/search/${searchType}`,
        {
          params: {
            query: searchTerm,
            page,
            ...filters
          },
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      )
      setResults(response.data.results)
      setTotalPages(response.data.totalPages)
      setCurrentPage(page)
    } catch (err) {
      setError(err.response?.data?.message || 'Error performing search')
      toast.error('Failed to perform search')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(1)
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const addToPlaylist = async (clipId) => {
    // Implement add to playlist functionality
    toast.success('Added to playlist successfully')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSearchType('clips')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      searchType === 'clips'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <IconVideo className="h-5 w-5" />
                    Clips
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('playlists')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      searchType === 'playlists'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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
                  <option value="relevance">Sort by Relevance</option>
                  <option value="date">Sort by Date</option>
                  {searchType === 'clips' && <option value="duration">Sort by Duration</option>}
                </select>

                {searchType === 'clips' && (
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="any">Any Duration</option>
                    <option value="short">Short (&lt; 4 mins)</option>
                    <option value="medium">Medium (4-20 mins)</option>
                    <option value="long">Long (&gt; 20 mins)</option>
                  </select>
                )}

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="any">Any Time</option>
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'No results found. Try different search terms or filters.'
                  : 'Enter a search term to find clips and playlists.'}
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
                          src={`https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`}
                          alt={clip.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
                          {formatDuration(clip.duration)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {clip.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          By {clip.user.name} • {new Date(clip.createdAt).toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <a
                            href={`https://youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <IconPlayerPlay className="h-5 w-5" />
                            <span>Watch</span>
                          </a>
                          <button
                            onClick={() => addToPlaylist(clip._id)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <IconPlus className="h-5 w-5" />
                          </button>
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
                        <div className="flex items-center gap-3">
                          <IconPlaylist className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {playlist.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              By {playlist.user.name} • {playlist.clips.length} clips
                            </p>
                          </div>
                        </div>
                        {playlist.description && (
                          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            {playlist.description}
                          </p>
                        )}
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <IconVideo className="h-4 w-4" />
                            <span>Last updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}

          {/* Pagination */}
          {results.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
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
        </div>
      </div>
    </div>
  )
}