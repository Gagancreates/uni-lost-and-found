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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-400/50 via-purple-200/50 to-blue-400/50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <h1 
            className={`text-2xl sm:text-4xl font-bold text-gray-900 ${instrumentSerif.className} hover:opacity-80 transition-opacity cursor-pointer tracking-tight`}
            onClick={() => router.push('/')}
          >
            PESU Lost & Found
          </h1>

          {/* Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-base font-medium text-gray-800">
                  Welcome, {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-all hover:shadow-md active:transform active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-all hover:shadow-md active:transform active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="py-4 sm:py-5 flex justify-center sm:justify-start gap-3">
          <button
            onClick={() => onFilterChange("all")}
            className={`min-w-[120px] px-6 py-2.5 text-sm font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeFilter === "all"
                ? "bg-gray-800 text-white shadow-md"
                : "bg-white/90 hover:bg-white text-gray-800 hover:shadow-md"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => onFilterChange("Lost")}
            className={`min-w-[120px] px-6 py-2.5 text-sm font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeFilter === "Lost"
                ? "bg-red-500 text-white shadow-md"
                : "bg-white/90 hover:bg-white text-gray-800 hover:shadow-md"
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => onFilterChange("Found")}
            className={`min-w-[120px] px-6 py-2.5 text-sm font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
              activeFilter === "Found"
                ? "bg-green-500 text-white shadow-md"
                : "bg-white/90 hover:bg-white text-gray-800 hover:shadow-md"
            }`}
          >
            Found Items
          </button>
        </div>
      </div>
    </header>
  )
}
