"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import PostList from "@/components/post-list"
import CreatePostFAB from "@/components/create-post-fab"
import CreatePostModal from "@/components/create-post-modal"
import type { Post, PostType } from "@/types/post"
import { fetchPosts } from "@/services/api"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<PostType | "all">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { user } = useAuth()

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const type = activeFilter !== "all" ? activeFilter : undefined
        const result = await fetchPosts(type, currentPage)
        setPosts(result.posts)
        setTotalPages(result.totalPages)
      } catch (err: any) {
        console.error('Error in page component:', err)
        if (err.message.includes('Cannot connect to the server')) {
          setError('Cannot connect to the backend server. Please make sure the backend is running on port 5000.')
        } else {
          setError(err.message || 'Failed to load posts')
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPosts()
  }, [activeFilter, currentPage])

  const handleCreatePost = async (newPost: Omit<Post, "id" | "createdAt">) => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    
    try {
      setIsModalOpen(false)
      
      const type = activeFilter !== "all" ? activeFilter : undefined
      const result = await fetchPosts(type, 1)
      setPosts(result.posts)
      setTotalPages(result.totalPages)
      setCurrentPage(1)
    } catch (err: any) {
      if (err.message.includes('Cannot connect to the server')) {
        setError('Cannot connect to the backend server. Please make sure the backend is running on port 5000.')
      } else {
        setError(err.message || 'Failed to refresh posts')
      }
    }
  }

  const handleOpenModal = () => {
    if (!user) {
      window.location.href = '/auth/login'
      return
    }
    
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </main>

      <CreatePostFAB onClick={handleOpenModal} />
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />
    </div>
  )
}
