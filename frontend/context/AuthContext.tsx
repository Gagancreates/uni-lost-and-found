"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { User, UserCredentials, UserRegistration } from '@/types/user'
import Cookies from 'js-cookie'

// API URL - Update this to your production URL when deploying
const API_URL = 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (credentials: UserCredentials) => Promise<void>
  register: (userData: UserRegistration) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for saved user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user data', e)
        localStorage.removeItem('user') // Remove invalid data
      }
    }
  }, [])

  const login = async (credentials: UserCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }))

      if (!response.ok) {
        throw new Error(data.error || `Login failed: ${response.status} ${response.statusText}`)
      }

      const userData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        token: data.token
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Save token in cookie for middleware
      Cookies.set('token', data.token, { expires: 30 }) // 30 days expiry
      
      setUser(userData)
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Cannot connect to the server. Please check if the backend is running.')
      } else {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: UserRegistration) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate SRN format
      const srnRegex = /^PES\dUG\d{6}$/
      if (!srnRegex.test(userData.srn)) {
        throw new Error('SRN must be in the format PESxUGxxxxxxx')
      }

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          srn: userData.srn // Include SRN in the backend request
        }),
      })

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }))

      if (!response.ok) {
        throw new Error(data.error || `Registration failed: ${response.status} ${response.statusText}`)
      }

      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        srn: userData.srn,
        token: data.token
      }

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser))
      
      // Save token in cookie for middleware
      Cookies.set('token', data.token, { expires: 30 }) // 30 days expiry
      
      setUser(newUser)
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Cannot connect to the server. Please check if the backend is running.')
      } else {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    Cookies.remove('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 