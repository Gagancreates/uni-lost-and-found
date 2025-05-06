"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import type { Post, PostType } from "@/types/post"
import { ImagePlus } from "lucide-react"
import { createPost } from "@/services/api"

interface PostFormProps {
  type: PostType
  onSubmit: (post: Omit<Post, "id" | "createdAt">) => void
  onCancel: () => void
}

export default function PostForm({ type, onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    currentLocation: "",
    contactInfo: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create FormData for the API call
      const postFormData = new FormData()
      postFormData.append('title', formData.title)
      postFormData.append('description', formData.description)
      postFormData.append('location', formData.location)
      postFormData.append('contactInfo', formData.contactInfo)
      postFormData.append('type', type.charAt(0).toUpperCase() + type.slice(1)) // Capitalize the first letter
      
      if (type === "Found" && formData.currentLocation) {
        postFormData.append('currentLocation', formData.currentLocation)
      }
      
      if (selectedFile) {
        postFormData.append('image', selectedFile)
      }

      // Send the form data to the API
      const createdPost = await createPost(postFormData)
      
      // Call the onSubmit prop with the returned post
      onSubmit(createdPost)
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
          placeholder="Brief title of the item"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
          placeholder="Detailed description of the item"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          {type === "Lost" ? "Where did you lose it?" : "Where did you find it?"} *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
          placeholder="Location details"
        />
      </div>

      {type === "Found" && (
        <div>
          <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Where is it currently? *
          </label>
          <input
            type="text"
            id="currentLocation"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
            placeholder="Where are you keeping the item?"
          />
        </div>
      )}

      <div>
        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Info *
        </label>
        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
          placeholder="How to contact you?( Email, Phone Number, etc.)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
        <div className="mt-1 flex items-center">
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ImagePlus className="h-5 w-5 mr-2 text-gray-500" />
            Upload Image
          </label>
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="ml-4 relative h-16 w-16 rounded-md overflow-hidden">
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
