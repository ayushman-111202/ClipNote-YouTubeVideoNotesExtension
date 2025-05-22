"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams } from 'next/navigation'
import { IconStarFilled, IconUser, IconCalendar } from '@tabler/icons-react'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Bug Report', label: 'Bug Report' },
  { value: 'Feature Request', label: 'Feature Request' },
  { value: 'General', label: 'General' }
]

const starsOptions = [
  { value: '', label: 'All Ratings' },
  ...[5, 4, 3, 2, 1].map(n => ({ value: String(n), label: `${n} Stars & Up` }))
]

export default function ManageFeedback() {
  const { user, isAdmin } = useAuth()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStars, setFilterStars] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    if (!user) return
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/feedback/getall`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        setFeedbacks(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load feedbacks')
      } finally {
        setLoading(false)
      }
    }
    fetchFeedbacks()
  }, [user])

  useEffect(() => {
    setFilterCategory(initialCategory)
  }, [initialCategory])

  const displayed = feedbacks
    .filter(fb => filterCategory === '' || fb.category === filterCategory)
    .filter(fb => filterStars === '' || fb.stars >= Number(filterStars))
    .filter(fb => fb.email.toLowerCase().includes(searchEmail.toLowerCase()))

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-600">
        Access denied. Admins only.
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Feedback</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          placeholder="Search by email..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select
          value={filterStars}
          onChange={e => setFilterStars(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {starsOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading feedbacks…</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No feedbacks match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(fb => (
            <div key={fb._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <IconUser /><span className="font-medium">{fb.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <IconCalendar /><span>{new Date(fb.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="mb-2">
                <span className="px-2 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {fb.category}
                </span>
              </div>
              <p className="mb-2">{fb.description}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={20}
                    className={`${i < fb.stars ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
