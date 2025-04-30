import Image from "next/image"
import type { Post } from "@/types/post"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-gray-300 transition-all hover:shadow-2xl before:absolute before:inset-0 before:rounded-xl before:bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.08)_0%,_rgba(236,72,153,0.08)_50%,_rgba(249,115,22,0.08)_100%)] before:border-2 before:border-transparent before:content-['']">
      {/* Status badge */}
      <div
        className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg ${
          post.type === "lost" ? "bg-red-500" : "bg-green-500" 
        }`}
      >
        {post.type.toUpperCase()}
      </div>

      {/* Image (if available) */}
      {post.image && (
        <div className="relative w-full h-48">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>

        <p className="text-sm text-gray-600 mb-3">{post.description}</p>

        <div className="space-y-2 text-sm">
          <p className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">Location:</span>
            <span className="text-gray-600">{post.location}</span>
          </p>

          {post.type === "found" && post.currentLocation && (
            <p className="flex items-start">
              <span className="font-medium text-gray-700 mr-2">Currently at:</span>
              <span className="text-gray-600">{post.currentLocation}</span>
            </p>
          )}

          <p className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">Contact:</span>
            <span className="text-gray-600">{post.contactInfo}</span>
          </p>

          <p className="text-xs text-gray-500 mt-3">
            Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  )
}
