"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import PostList from "@/components/post-list"
import CreatePostFAB from "@/components/create-post-fab"
import CreatePostModal from "@/components/create-post-modal"
import type { Post, PostType } from "@/types/post"
import { fetchPosts } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<PostType | "all">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { user } = useAuth()
  const router = useRouter()

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
      router.push('/auth/login')
      return
    }
    
    // After creating post successfully, refresh the posts list
    try {
      setIsModalOpen(false)
      
      // Reload posts from the server
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
      router.push('/auth/login')
      return
    }
    
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100/10 to-blue-100/50 pb-20">
      <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="container mx-auto px-4 pt-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            {error.includes('backend') && (
              <div className="mt-2 text-sm">
                <p>Please make sure that:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>You have started the backend server with <code className="bg-gray-200 px-1 rounded">npm run dev</code> in the backend directory</li>
                  <li>The backend server is running on port 5000</li>
                  <li>There are no firewall issues blocking the connection</li>
                </ul>
              </div>
            )}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <PostList posts={posts} />
            
            {posts.length === 0 && !error && (
              <div className="text-center py-8 text-gray-500">
                No posts found. Be the first to create one!
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CreatePostFAB onClick={handleOpenModal} />

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />
    </main>
  )
}
