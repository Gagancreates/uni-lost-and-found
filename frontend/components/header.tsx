"use client"

import type { PostType } from "@/types/post"
import { Instrument_Serif } from "next/font/google"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
})

interface HeaderProps {
  activeFilter: PostType | "all"
  onFilterChange: (filter: PostType | "all") => void
}

export default function Header({ activeFilter, onFilterChange }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-pink-400/50 via-purple-200/50 to-blue-400/50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-4xl font-bold text-black ${instrumentSerif.className}`}>PESU Lost and Found</h1>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Welcome, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange("Lost")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "Lost" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Lost
          </button>
          <button
            onClick={() => onFilterChange("Found")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "Found" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Found
          </button>
        </div>
      </div>
    </header>
  )
}
