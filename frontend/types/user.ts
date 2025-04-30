export interface User {
  id: string
  name: string
  email: string
  srn?: string // Student Registration Number (SRN) for PESU students
  token: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegistration {
  name: string
  email: string
  srn: string
  password: string
} 