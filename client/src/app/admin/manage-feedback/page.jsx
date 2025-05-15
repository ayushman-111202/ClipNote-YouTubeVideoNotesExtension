'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconSearch, 
  IconMessageCircle,
  IconTrash, 
  IconX,
  IconFilter,
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react'

export default function ManageFeedback() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Fetch feedback list
  const fetchFeedback = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing');
      }

      // Check if API URL is defined
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feedback`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Check if response data exists
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setFeedback(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      
      // Handle specific error cases
      if (!process.env.NEXT_PUBLIC_API_URL) {
        setError('API URL is not configured. Please check environment variables.');
        return;
      }

      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        router.replace('/login');
        return;
      }

      if (err.response?.status === 403) {
        toast.error('You do not have permission to access this resource.');
        router.replace('/');
        return;
      }

      const errorMessage = err.response?.data?.message || err.message || 'Error fetching feedback';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    fetchFeedback()
  }, [user])

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Reset to first page when searching
    setCurrentPage(1)
  }

  // Handle filter
  const handleFilterChange = (status) => {
    setFilterStatus(status)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  // Reply to feedback
  const handleReplySubmit = async (e) => {
    e.preventDefault()
    
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty')
      return
    }
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${selectedFeedback._id}/reply`,
        { reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success('Reply sent successfully')
      setReplyText('')
      closeDetailModal()
      fetchFeedback() // Refresh the feedback list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply')
    }
  }

  // Mark feedback as resolved/unresolved
  const toggleFeedbackStatus = async (feedbackId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'resolved' ? 'pending' : 'resolved'
      
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${feedbackId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success(`Feedback marked as ${newStatus}`)
      fetchFeedback() // Refresh the feedback list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  // Delete feedback
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${feedbackId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success('Feedback deleted successfully')
      fetchFeedback() // Refresh the feedback list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete feedback')
    }
  }

  // Toggle importance flag
  const toggleImportance = async (feedbackId, isImportant) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/feedback/${feedbackId}/importance`,
        { isImportant: !isImportant },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success(isImportant ? 'Removed from important' : 'Marked as important')
      fetchFeedback() // Refresh the feedback list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update importance')
    }
  }

  // Open detail modal
  const openDetailModal = (feedbackItem) => {
    setSelectedFeedback(feedbackItem)
    setIsDetailModalOpen(true)
  }

  // Close detail modal
  const closeDetailModal = () => {
    setSelectedFeedback(null)
    setIsDetailModalOpen(false)
    setReplyText('')
  }

  // Filter and sort feedback data
  const getProcessedFeedback = () => {
    // First filter the data
    let filteredData = [...feedback]
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filteredData = filteredData.filter(item => item.status === filterStatus)
    }
    
    // Apply search term
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      // Handle sorting by date
      if (sortConfig.key === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      }
      
      // Handle importance flag sorting
      if (sortConfig.key === 'isImportant') {
        if (sortConfig.direction === 'asc') {
          return a.isImportant === b.isImportant ? 0 : a.isImportant ? 1 : -1
        } else {
          return a.isImportant === b.isImportant ? 0 : a.isImportant ? -1 : 1
        }
      }
      
      // Default string comparison for other fields
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
    
    return filteredData
  }

  // Pagination logic
  const processedFeedback = getProcessedFeedback()
  const totalPages = Math.ceil(processedFeedback.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = processedFeedback.slice(indexOfFirstItem, indexOfLastItem)
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Feedback</h1>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search feedback..."
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
          
          {/* Filter Tabs */}
          <div className="mt-6 flex justify-start space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'all' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('resolved')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'resolved' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => handleFilterChange('important')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'important' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Important
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('isImportant')}
                >
                  <div className="flex items-center">
                    <span>Important</span>
                    {sortConfig.key === 'isImportant' && (
                      sortConfig.direction === 'asc' 
                        ? <IconArrowUp size={14} className="ml-1" />
                        : <IconArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('createdAt')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' 
                        ? <IconArrowUp size={14} className="ml-1" />
                        : <IconArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No feedback found
                  </td>
                </tr>
              ) : (
                currentItems.map((feedbackItem) => (
                  <tr key={feedbackItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleImportance(feedbackItem._id, feedbackItem.isImportant)}
                        className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300"
                      >
                        {feedbackItem.isImportant ? (
                          <IconStarFilled size={20} className="text-yellow-500" />
                        ) : (
                          <IconStar size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {feedbackItem.userId?.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {feedbackItem.userId?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {feedbackItem.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        feedbackItem.status === 'resolved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {feedbackItem.status.charAt(0).toUpperCase() + feedbackItem.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(feedbackItem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleFeedbackStatus(feedbackItem._id, feedbackItem.status)}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                          feedbackItem.status === 'resolved'
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100'
                            : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
                        }`}
                        title={feedbackItem.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                      >
                        {feedbackItem.status === 'resolved' ? <IconX size={16} /> : <IconCheck size={16} />}
                      </button>
                      <button
                        onClick={() => openDetailModal(feedbackItem)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
                        title="View Details"
                      >
                        <IconMessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFeedback(feedbackItem._id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
                        title="Delete"
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {processedFeedback.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, processedFeedback.length)}
                  </span>{' '}
                  of <span className="font-medium">{processedFeedback.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <IconChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    // Show limited page numbers to avoid clutter
                    if (
                      totalPages <= 5 ||
                      i === 0 ||
                      i === totalPages - 1 ||
                      (i >= currentPage - 2 && i <= currentPage)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    }
                    // Add ellipsis
                    if (i === 1 && currentPage > 3) {
                      return (
                        <span
                          key={i}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        >
                          ...
                        </span>
                      )
                    }
                    if (i === totalPages - 2 && currentPage < totalPages - 2) {
                      return (
                        <span
                          key={i}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <IconChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {isDetailModalOpen && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-3xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feedback Details</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <IconX size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Feedback Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedFeedback.userId?.name || 'Anonymous User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFeedback.userId?.email || 'No email provided'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedFeedback.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                    </span>
                    {selectedFeedback.isImportant && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                        Important
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedFeedback.message}
                  </p>
                </div>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <IconCalendarEvent size={16} className="mr-1" />
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </div>
                  {selectedFeedback.category && (
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
                      {selectedFeedback.category}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Previous Replies */}
              {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Previous Replies</h4>
                  <div className="space-y-3">
                    {selectedFeedback.replies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reply.createdAt).toLocaleString()} by {reply.admin?.name || 'Admin'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reply Form */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reply to Feedback</h4>
                <form onSubmit={handleReplySubmit}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="4"
                    placeholder="Write your reply here..."
                  ></textarea>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDetailModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}