'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { 
  IconVideo,
  IconPlaylist,
  IconClock,
  IconPlayerPlay,
  IconPlus,
  IconChartBar,
  IconArrowRight
} from '@tabler/icons-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    recentClips: [],
    recentPlaylists: [],
    stats: {
      totalClips: 0,
      totalPlaylists: 0,
      watchTime: 0
    }
  })

  useEffect(() => {
    if (user?.token) {
      fetchDashboardData()
    }
  }, [user?.token])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      )
      setDashboardData(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching dashboard data')
      toast.error('Failed to fetch dashboard data')
      setLoading(false)
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Here's an overview of your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clips</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {dashboardData.stats.totalClips}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <IconVideo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Playlists</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {dashboardData.stats.totalPlaylists}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <IconPlaylist className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Watch Time</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {formatDuration(dashboardData.stats.watchTime)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
              <IconClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/user/clips"
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <IconPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Clip</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a new video clip to your library</p>
            </div>
          </div>
          <IconArrowRight className="h-5 w-5 text-gray-400" />
        </Link>

        <Link
          href="/user/playlists"
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <IconPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Playlist</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organize your clips into a playlist</p>
            </div>
          </div>
          <IconArrowRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Clips</h2>
              <Link
                href="/user/clips"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                View All <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentClips.map((clip) => (
              <div key={clip._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start gap-4">
                  <img
                    src={`https://img.youtube.com/vi/${clip.videoId}/default.jpg`}
                    alt={clip.title}
                    className="w-24 h-18 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {clip.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Added {new Date(clip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={`https://youtube.com/watch?v=${clip.videoId}&t=${clip.startTime}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <IconPlayerPlay className="h-4 w-4" />
                    <span className="text-sm">Watch</span>
                  </a>
                </div>
              </div>
            ))}
            {dashboardData.recentClips.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No clips yet. Start by creating your first clip!
              </div>
            )}
          </div>
        </div>

        {/* Recent Playlists */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Playlists</h2>
              <Link
                href="/user/playlists"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                View All <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentPlaylists.map((playlist) => (
              <div key={playlist._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded dark:bg-green-900">
                    <IconPlaylist className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {playlist.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {playlist.clips?.length || 0} clips • Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/user/playlists/${playlist._id}`}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <IconArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
            {dashboardData.recentPlaylists.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No playlists yet. Create one to organize your clips!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
