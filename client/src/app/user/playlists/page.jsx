// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'
// import { 
//   IconPlaylist,
//   IconTrash, 
//   IconEdit,
//   IconPlus,
//   IconVideo,
//   IconChevronLeft,
//   IconChevronRight,
//   IconSearch,
//   IconAdjustments
// } from '@tabler/icons-react'

// export default function Playlists() {
//   const { user } = useAuth()
//   const [playlists, setPlaylists] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [isCreating, setIsCreating] = useState(false)
//   const [newPlaylist, setNewPlaylist] = useState({
//     name: '',
//     description: ''
//   })
//   const [filters, setFilters] = useState({
//     sortBy: 'date',
//     order: 'desc'
//   })
//   const [isEditing, setIsEditing] = useState(false)
//   const [editingPlaylist, setEditingPlaylist] = useState(null)

//   const fetchPlaylists = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${user?.id}`,
//         {
//           params: {
//             page,
//             search: searchTerm,
//             sortBy: filters.sortBy,
//             order: filters.order
//           },
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         }
//       );
      
//       const { playlists, totalPages: total, currentPage } = response.data;
//       setPlaylists(playlists);
//       setTotalPages(total);
//       setCurrentPage(currentPage);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error fetching playlists');
//       toast.error('Failed to fetch playlists');
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (user?.token) {
//       fetchPlaylists()
//     }
//   }, [user?.token])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setCurrentPage(1)
//     fetchPlaylists(1)
//   }

//   const handleCreatePlaylist = async (e) => {
//     e.preventDefault()
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/add`,
//         {
//           ...newPlaylist,
//           userId: user?.id
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         }
//       )
//       setIsCreating(false)
//       setNewPlaylist({ name: '', description: '' })
//       fetchPlaylists(currentPage)
//       toast.success('Playlist created successfully')
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error creating playlist')
//     }
//   }

//   const handleDeletePlaylist = async (playlistId) => {
//     if (!window.confirm('Are you sure you want to delete this playlist?')) {
//       return
//     }

//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/delete/${playlistId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         }
//       )
//       fetchPlaylists(currentPage)
//       toast.success('Playlist deleted successfully')
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error deleting playlist')
//     }
//   }

//   const handleEditPlaylist = async (playlistId) => {
//     const playlist = playlists.find(p => p._id === playlistId)
//     if (playlist) {
//       setEditingPlaylist(playlist)
//       setNewPlaylist({
//         name: playlist.name,
//         description: playlist.description || ''
//       })
//       setIsCreating(true)
//     }
//   }

//   const handleUpdatePlaylist = async (e) => {
//     e.preventDefault()
//     try {
//       await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/update/${editingPlaylist._id}`,
//         newPlaylist,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         }
//       )
//       setIsCreating(false)
//       setEditingPlaylist(null)
//       setNewPlaylist({ name: '', description: '' })
//       fetchPlaylists(currentPage)
//       toast.success('Playlist updated successfully')
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error updating playlist')
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
//         <div className="text-red-500">{error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
//         {/* Header and Search */}
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Playlists</h1>
//             <div className="flex items-center gap-4">
//               <form onSubmit={handleSearch} className="flex items-center">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search playlists..."
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFilters({ sortBy: 'date', order: 'desc' })}
//                   className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
//                 >
//                   <IconAdjustments className="h-5 w-5" />
//                 </button>
//               </form>
//               <button
//                 onClick={() => setIsCreating(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 <IconPlus className="h-5 w-5" />
//                 New Playlist
//               </button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="mt-4 flex flex-wrap gap-4">
//             <select
//               value={filters.sortBy}
//               onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               <option value="date">Sort by Date</option>
//               <option value="name">Sort by Name</option>
//               <option value="clips">Sort by Clips Count</option>
//             </select>
//             <select
//               value={filters.order}
//               onChange={(e) => setFilters({ ...filters, order: e.target.value })}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               <option value="desc">Descending</option>
//               <option value="asc">Ascending</option>
//             </select>
//           </div>

//           {/* Create Playlist Form */}
//           {isCreating && (
//             <div className="mt-6">
//               <form onSubmit={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist} className="space-y-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Playlist Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={newPlaylist.name}
//                     onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
//                     required
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={newPlaylist.description}
//                     onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
//                     rows={3}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsCreating(false)
//                       setEditingPlaylist(null)
//                       setNewPlaylist({ name: '', description: '' })
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     {editingPlaylist ? 'Update' : 'Create'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>

//         {/* Playlists Grid */}
//         <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {playlists.map((playlist) => (
//             <div
//               key={playlist._id}
//               className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <IconPlaylist className="h-8 w-8 text-blue-500" />
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         {playlist.name}
//                       </h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {playlist.clips?.length || 0} clips
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleEditPlaylist(playlist._id)}
//                       className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
//                     >
//                       <IconEdit className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDeletePlaylist(playlist._id)}
//                       className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
//                     >
//                       <IconTrash className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//                 {playlist.description && (
//                   <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
//                     {playlist.description}
//                   </p>
//                 )}
//                 <div className="mt-4">
//                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//                     <IconVideo className="h-4 w-4" />
//                     <span>Last updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => fetchPlaylists(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => fetchPlaylists(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700 dark:text-gray-300">
//                 Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                 <span className="font-medium">{totalPages}</span>
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => fetchPlaylists(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <IconChevronLeft className="h-5 w-5" />
//                 </button>
//                 <button
//                   onClick={() => fetchPlaylists(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <IconChevronRight className="h-5 w-5" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//-------------------------------------------------------------------------------------------------

// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'
// import Link from 'next/link'
// import { 
//   IconPlaylist, 
//   IconTrash, 
//   IconEdit, 
//   IconVideo,
//   IconChevronLeft,
//   IconChevronRight,
//   IconSearch,
//   IconAdjustments,
//   IconPlus,
//   IconX,
//   IconCheck
// } from '@tabler/icons-react'

// export default function Playlists() {
//   const { user } = useAuth()
//   const [playlists, setPlaylists] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalResults, setTotalResults] = useState(0)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [editingPlaylist, setEditingPlaylist] = useState(null)
//   const [filters, setFilters] = useState({
//     sortBy: 'updatedAt',
//     order: 'desc'
//   })
//   const [newPlaylist, setNewPlaylist] = useState({
//     name: '',
//     description: ''
//   })

//   // Debug logging
//   useEffect(() => {
//     console.log('Playlists - User object:', user)
//   }, [user])

//   const fetchPlaylists = async (page = 1) => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!user?.token) {
//         setError('Please login to view your playlists')
//         return
//       }

//       const userId = user._id || user.id
//       if (!userId) {
//         setError('User ID not found')
//         return
//       }

//       console.log('Fetching playlists for user:', userId)

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           },
//           params: {
//             search: searchTerm,
//             sortBy: filters.sortBy,
//             order: filters.order,
//             page,
//             limit: 12
//           }
//         }
//       )
      
//       console.log('Playlists API Response:', response.data)
      
//       // Handle different response formats
//       if (response.data.playlists) {
//         setPlaylists(response.data.playlists)
//         setTotalResults(response.data.total || 0)
//         setTotalPages(response.data.totalPages || 1)
//         setCurrentPage(response.data.currentPage || 1)
//       } else if (Array.isArray(response.data)) {
//         setPlaylists(response.data)
//         setTotalResults(response.data.length)
//         setTotalPages(1)
//         setCurrentPage(1)
//       } else {
//         setPlaylists([])
//         setTotalResults(0)
//         setTotalPages(1)
//         setCurrentPage(1)
//       }
      
//     } catch (err) {
//       console.error('Error fetching playlists:', err)
//       console.error('Playlists error response:', err.response?.data)
      
//       let errorMessage = 'Error fetching playlists'
//       if (err.response?.status === 401) {
//         errorMessage = 'Authentication failed. Please login again.'
//       } else if (err.response?.data?.error) {
//         errorMessage = err.response.data.error
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message
//       }
      
//       setError(errorMessage)
//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (user?.token && (user?._id || user?.id)) {
//       fetchPlaylists()
//     }
//   }, [user?.token, user?._id, user?.id, filters])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setCurrentPage(1)
//     fetchPlaylists(1)
//   }

//   const handleCreatePlaylist = async (e) => {
//     e.preventDefault()
    
//     if (!newPlaylist.name.trim()) {
//       toast.error('Playlist name is required')
//       return
//     }

//     try {
//       console.log('Creating playlist:', newPlaylist)
      
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/add`,
//         {
//           name: newPlaylist.name.trim(),
//           description: newPlaylist.description.trim()
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type':



//-------------------------------------------------------------------------------------------------


// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'
// import Link from 'next/link'
// import { 
//   IconPlaylist, 
//   IconTrash, 
//   IconEdit, 
//   IconVideo,
//   IconChevronLeft,
//   IconChevronRight,
//   IconSearch,
//   IconAdjustments,
//   IconPlus,
//   IconX,
//   IconCheck
// } from '@tabler/icons-react'

// export default function Playlists() {
//   const { user } = useAuth()
//   const [playlists, setPlaylists] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalResults, setTotalResults] = useState(0)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [editingPlaylist, setEditingPlaylist] = useState(null)
//   const [filters, setFilters] = useState({
//     sortBy: 'updatedAt',
//     order: 'desc'
//   })
//   const [newPlaylist, setNewPlaylist] = useState({
//     name: '',
//     description: ''
//   })

//   // Debug logging
//   useEffect(() => {
//     console.log('Playlists - User object:', user)
//   }, [user])

//   const fetchPlaylists = async (page = 1) => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       if (!user?.token) {
//         setError('Please login to view your playlists')
//         return
//       }

//       const userId = user._id || user.id
//       if (!userId) {
//         setError('User ID not found')
//         return
//       }

//       console.log('Fetching playlists for user:', userId)

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           },
//           params: {
//             search: searchTerm,
//             sortBy: filters.sortBy,
//             order: filters.order,
//             page,
//             limit: 12
//           }
//         }
//       )
      
//       console.log('Playlists API Response:', response.data)
      
//       // Handle different response formats
//       if (response.data.playlists) {
//         setPlaylists(response.data.playlists)
//         setTotalResults(response.data.total || 0)
//         setTotalPages(response.data.totalPages || 1)
//         setCurrentPage(response.data.currentPage || 1)
//       } else if (Array.isArray(response.data)) {
//         setPlaylists(response.data)
//         setTotalResults(response.data.length)
//         setTotalPages(1)
//         setCurrentPage(1)
//       } else {
//         setPlaylists([])
//         setTotalResults(0)
//         setTotalPages(1)
//         setCurrentPage(1)
//       }
      
//     } catch (err) {
//       console.error('Error fetching playlists:', err)
//       console.error('Playlists error response:', err.response?.data)
      
//       let errorMessage = 'Error fetching playlists'
//       if (err.response?.status === 401) {
//         errorMessage = 'Authentication failed. Please login again.'
//       } else if (err.response?.data?.error) {
//         errorMessage = err.response.data.error
//       } else if (err.response?.data?.message) {
//         errorMessage = err.response.data.message
//       }
      
//       setError(errorMessage)
//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (user?.token && (user?._id || user?.id)) {
//       fetchPlaylists()
//     }
//   }, [user?.token, user?._id, user?.id, filters])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     setCurrentPage(1)
//     fetchPlaylists(1)
//   }

//   const handleCreatePlaylist = async (e) => {
//     e.preventDefault()
    
//     if (!newPlaylist.name.trim()) {
//       toast.error('Playlist name is required')
//       return
//     }

//     try {
//       console.log('Creating playlist:', newPlaylist)
      
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/add`,
//         {
//           name: newPlaylist.name.trim(),
//           description: newPlaylist.description.trim()
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       )

//       toast.success('Playlist created successfully!')
//       setShowCreateModal(false)
//       setNewPlaylist({ name: '', description: '' })
//       fetchPlaylists()
//     } catch (err) {
//       console.error('Error creating playlist:', err)
//       toast.error(err.response?.data?.message || 'Failed to create playlist')
//     }
//   }

//   const handleUpdatePlaylist = async (e) => {
//     e.preventDefault()
    
//     if (!editingPlaylist?.name?.trim()) {
//       toast.error('Playlist name is required')
//       return
//     }

//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/${editingPlaylist._id}`,
//         {
//           name: editingPlaylist.name.trim(),
//           description: editingPlaylist.description?.trim() || ''
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       )

//       toast.success('Playlist updated successfully!')
//       setEditingPlaylist(null)
//       fetchPlaylists()
//     } catch (err) {
//       console.error('Error updating playlist:', err)
//       toast.error(err.response?.data?.message || 'Failed to update playlist')
//     }
//   }

//   const handleDeletePlaylist = async (playlistId) => {
//     if (!confirm('Are you sure you want to delete this playlist?')) return

//     try {
//       const response = await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`
//           }
//         }
//       )

//       toast.success('Playlist deleted successfully!')
//       fetchPlaylists()
//     } catch (err) {
//       console.error('Error deleting playlist:', err)
//       toast.error(err.response?.data?.message || 'Failed to delete playlist')
//     }
//   }

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return
//     setCurrentPage(newPage)
//     fetchPlaylists(newPage)
//   }

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value
//     }))
//     setCurrentPage(1)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//         <h1 className="text-3xl font-bold flex items-center gap-2">
//           <IconPlaylist size={32} />
//           My Playlists
//         </h1>
        
//         <div className="flex gap-4">
//           <button 
//             onClick={() => setShowCreateModal(true)}
//             className="btn btn-primary flex items-center gap-2"
//           >
//             <IconPlus size={20} />
//             Create Playlist
//           </button>
//         </div>
//       </div>

//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <form onSubmit={handleSearch} className="flex-1 relative">
//           <input
//             type="text"
//             placeholder="Search playlists..."
//             className="input input-bordered w-full pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
//             <IconSearch size={20} className="text-gray-400" />
//           </button>
//         </form>

//         <div className="dropdown dropdown-end">
//           <button tabIndex={0} className="btn btn-outline flex items-center gap-2">
//             <IconAdjustments size={20} />
//             Filters
//           </button>
//           <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
//             <li>
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Sort By</span>
//                 </label>
//                 <select 
//                   className="select select-bordered"
//                   value={filters.sortBy}
//                   onChange={(e) => handleFilterChange('sortBy', e.target.value)}
//                 >
//                   <option value="createdAt">Created Date</option>
//                   <option value="updatedAt">Updated Date</option>
//                   <option value="name">Name</option>
//                 </select>
//               </div>
//             </li>
//             <li className="mt-2">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Order</span>
//                 </label>
//                 <select 
//                   className="select select-bordered"
//                   value={filters.order}
//                   onChange={(e) => handleFilterChange('order', e.target.value)}
//                 >
//                   <option value="asc">Ascending</option>
//                   <option value="desc">Descending</option>
//                 </select>
//               </div>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <span className="loading loading-spinner loading-lg"></span>
//         </div>
//       ) : error ? (
//         <div className="alert alert-error">
//           <span>{error}</span>
//         </div>
//       ) : playlists.length === 0 ? (
//         <div className="text-center py-12">
//           <IconPlaylist size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-medium">No playlists found</h3>
//           <p className="text-gray-500 mb-4">
//             {searchTerm ? 'Try a different search term' : 'Create your first playlist to get started'}
//           </p>
//           <button 
//             onClick={() => setShowCreateModal(true)}
//             className="btn btn-primary"
//           >
//             Create Playlist
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {playlists.map((playlist) => (
//               <div key={playlist._id} className="card bg-base-100 shadow-xl">
//                 <div className="card-body">
//                   <div className="flex justify-between items-start">
//                     <h2 className="card-title truncate">{playlist.name}</h2>
//                     <div className="dropdown dropdown-end">
//                       <button tabIndex={0} className="btn btn-ghost btn-sm">
//                         <IconEdit size={18} />
//                       </button>
//                       <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
//                         <li>
//                           <button onClick={() => setEditingPlaylist(playlist)}>
//                             Edit
//                           </button>
//                         </li>
//                         <li>
//                           <button onClick={() => handleDeletePlaylist(playlist._id)} className="text-error">
//                             Delete
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   {playlist.description && (
//                     <p className="text-gray-500 line-clamp-2">{playlist.description}</p>
//                   )}
//                   <div className="flex items-center gap-1 text-sm text-gray-400">
//                     <IconVideo size={16} />
//                     <span>{playlist.videos?.length || 0} videos</span>
//                   </div>
//                   <div className="card-actions justify-end mt-2">
//                     <Link 
//                       href={`/playlists/${playlist._id}`}
//                       className="btn btn-primary btn-sm"
//                     >
//                       View Playlist
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <div className="join">
//                 <button 
//                   className="join-item btn"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <IconChevronLeft size={20} />
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
//                     onClick={() => handlePageChange(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button 
//                   className="join-item btn"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   <IconChevronRight size={20} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Create Playlist Modal */}
//       {showCreateModal && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">Create New Playlist</h3>
//               <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm">
//                 <IconX size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleCreatePlaylist}>
//               <div className="form-control mb-4">
//                 <label className="label">
//                   <span className="label-text">Playlist Name*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter playlist name"
//                   className="input input-bordered w-full"
//                   value={newPlaylist.name}
//                   onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className="form-control mb-6">
//                 <label className="label">
//                   <span className="label-text">Description</span>
//                 </label>
//                 <textarea
//                   placeholder="Enter playlist description (optional)"
//                   className="textarea textarea-bordered w-full"
//                   rows={3}
//                   value={newPlaylist.description}
//                   onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
//                 />
//               </div>
//               <div className="modal-action">
//                 <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Create Playlist
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Playlist Modal */}
//       {editingPlaylist && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">Edit Playlist</h3>
//               <button onClick={() => setEditingPlaylist(null)} className="btn btn-ghost btn-sm">
//                 <IconX size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleUpdatePlaylist}>
//               <div className="form-control mb-4">
//                 <label className="label">
//                   <span className="label-text">Playlist Name*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter playlist name"
//                   className="input input-bordered w-full"
//                   value={editingPlaylist.name}
//                   onChange={(e) => setEditingPlaylist({...editingPlaylist, name: e.target.value})}
//                   required
//                 />
//               </div>
//               <div className="form-control mb-6">
//                 <label className="label">
//                   <span className="label-text">Description</span>
//                 </label>
//                 <textarea
//                   placeholder="Enter playlist description (optional)"
//                   className="textarea textarea-bordered w-full"
//                   rows={3}
//                   value={editingPlaylist.description || ''}
//                   onChange={(e) => setEditingPlaylist({...editingPlaylist, description: e.target.value})}
//                 />
//               </div>
//               <div className="modal-action">
//                 <button type="button" onClick={() => setEditingPlaylist(null)} className="btn btn-ghost">
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  IconPlaylist,
  IconTrash,
  IconEdit,
  IconVideo,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconAdjustments,
  IconPlus,
  IconX
} from '@tabler/icons-react'

export default function Playlists() {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState(null)
  const [filters, setFilters] = useState({ sortBy: 'updatedAt', order: 'desc' })
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' })

  const fetchPlaylists = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      if (!user?.token) throw new Error('Please login to view your playlists')
      const userId = user._id || user.id
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/getbyuser/${userId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { search: searchTerm, sortBy: filters.sortBy, order: filters.order, page, limit: 12 }
        }
      )
      const data = response.data.playlists ? response.data : { playlists: response.data, total: response.data.length, totalPages: 1, currentPage: 1 }
      setPlaylists(data.playlists)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error fetching playlists'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) fetchPlaylists()
  }, [user, filters])

  const handleSearch = e => { e.preventDefault(); setCurrentPage(1); fetchPlaylists(1) }
  const handleFilterChange = (k, v) => { setFilters(prev => ({ ...prev, [k]: v })); setCurrentPage(1) }

  const handleCreatePlaylist = async e => {
    e.preventDefault()
    if (!newPlaylist.name.trim()) return toast.error('Playlist name is required')
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/add`,
        { name: newPlaylist.name.trim(), description: newPlaylist.description.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      toast.success('Playlist created!')
      setShowCreateModal(false)
      setNewPlaylist({ name: '', description: '' })
      fetchPlaylists()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create') }
  }

  const handleUpdatePlaylist = async e => {
    e.preventDefault()
    if (!editingPlaylist.name.trim()) return toast.error('Playlist name is required')
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${editingPlaylist._id}`,
        { name: editingPlaylist.name.trim(), description: editingPlaylist.description.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      toast.success('Playlist updated!')
      setEditingPlaylist(null)
      fetchPlaylists()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
  }

  const handleDeletePlaylist = async id => {
    if (!confirm('Delete this playlist?')) return
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      toast.success('Deleted!')
      fetchPlaylists()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IconPlaylist size={28} /> My Playlists
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <IconPlus size={20} /> Create Playlist
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search playlists..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>
          <div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <IconAdjustments size={20} /> Filters
            </button>
            {/* Dropdown content stays same or implement custom... */}
          </div>
        </div>

        {/* Playlists Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-20">
              <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></span>
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600 py-20">
              {error}
            </div>
          ) : playlists.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <IconPlaylist size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No results' : 'No playlists yet'}
              </h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            playlists.map(playlist => (
              <div
                key={playlist._id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow hover:shadow-md transition"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {playlist.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditingPlaylist(playlist)} title="Edit">
                        <IconEdit className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition" />
                      </button>
                      <button onClick={() => handleDeletePlaylist(playlist._id)} title="Delete">
                        <IconTrash className="h-5 w-5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition" />
                      </button>
                    </div>
                  </div>
                  {playlist.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/playlists/${playlist._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 flex justify-center">
            <button
              onClick={() => currentPage > 1 && fetchPlaylists(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              <IconChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => fetchPlaylists(page)}
                className={`px-3 py-1 mx-1 rounded-md border ${currentPage === page ? 'bg-blue-500 text-white' : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-600 transition`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => currentPage < totalPages && fetchPlaylists(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {(showCreateModal || editingPlaylist) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingPlaylist ? 'Edit Playlist' : 'Create Playlist'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setEditingPlaylist(null) }}>
                <IconX className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition" />
              </button>
            </div>
            <form onSubmit={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={editingPlaylist ? editingPlaylist.name : newPlaylist.name}
                  onChange={e => editingPlaylist ? setEditingPlaylist({...editingPlaylist, name: e.target.value}) : setNewPlaylist({...newPlaylist, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingPlaylist ? editingPlaylist.description : newPlaylist.description}
                  onChange={e => editingPlaylist ? setEditingPlaylist({...editingPlaylist, description: e.target.value}) : setNewPlaylist({...newPlaylist, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowCreateModal(false); setEditingPlaylist(null) }} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  {editingPlaylist ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
