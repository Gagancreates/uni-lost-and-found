"use client"

import { useState } from "react"
import { Wheat, X } from "lucide-react"
import type { Post, PostType } from "@/types/post"
import PostForm from "./post-form"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: Omit<Post, "id" | "createdAt">) => void
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [step, setStep] = useState<"select" | "form">("select")
  const [selectedType, setSelectedType] = useState<PostType | null>(null)

    const handleTypeSelect = (type: PostType) => {
      setSelectedType(type)
      setStep("form")
    }

  const handleClose = () => {
    onClose()
    // Reset state after animation completes
    setTimeout(() => {
      setStep("select")
      setSelectedType(null)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {step === "select" ? "Create New Post" : `Report ${selectedType === "lost" ? "Lost" : "Found"} Item`}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {step === "select" ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600">What do you want to post?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelect("lost")}
                  className="py-4 px-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 font-medium transition-colors"
                >
                  Lost Item
                </button>
                <button
                  onClick={() => handleTypeSelect("found")}
                  className="py-4 px-6 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg border border-green-200 font-medium transition-colors"
                >
                  Found Item
                </button>
              </div>
            </div>
          ) : (
            selectedType && <PostForm type={selectedType} onSubmit={onSubmit} onCancel={() => setStep("select")} />
          )}
        </div>
      </div>
    </div>
  )
}



// 1. Create a new post
// 2. Select the type of post
// 3. Fill in the form
// 4. Submit the form
// 5. Close the modal
// 6. Show a success message
// 7. Show a error message
  
