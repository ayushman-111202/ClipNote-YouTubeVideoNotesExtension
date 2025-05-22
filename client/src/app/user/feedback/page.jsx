'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const FeedbackForm = () => {
  const { user } = useAuth()
  const router = useRouter()

  const categories = [
    { value: '', label: 'Select category' },
    { value: 'Bug Report', label: 'Bug Report' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'General', label: 'General Feedback' }
  ]

  const initialValues = {
    description: '',
    stars: 5,
    category: ''
  }

  const validationSchema = Yup.object().shape({
    category: Yup.string()
      .required('Please select a category'),
    description: Yup.string()
      .required('Feedback description is required')
      .min(10, 'Feedback must be at least 10 characters')
      .max(500, 'Feedback cannot exceed 500 characters'),
    stars: Yup.number()
      .required('Rating is required')
      .min(1, 'Minimum rating is 1 star')
      .max(5, 'Maximum rating is 5 stars'),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const feedbackData = {
        ...values,
        email: user.email,
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/feedback/add`, feedbackData)
      alert('Thank you for your feedback!')
      resetForm()
      router.push('/')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Feedback Form</h2>
        <p className="text-center text-gray-600">
          Please sign in to submit feedback.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Feedback Form</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Help us improve by sharing your experience, reporting issues, or suggesting features.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-gray-700 mb-1">Category *</label>
              <Field
                as="select"
                name="category"
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-700 mb-1">
                Your Feedback *
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your experience, report issues, or suggest improvements..."
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Stars */}
            <div>
              <label className="block text-gray-700 mb-1">Rating *</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <label key={star} className="mr-2 cursor-pointer">
                    <Field type="radio" name="stars" value={String(star)} className="hidden" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 ${values.stars >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </label>
                ))}
              </div>
              <ErrorMessage name="stars" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="text-sm text-gray-500">
              You’re submitting feedback as: <strong>{user.email}</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default FeedbackForm
