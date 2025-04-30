export type PostType = "Lost" | "Found"

export interface Post {
  id: string
  type: PostType
  title: string
  description: string
  location: string
  currentLocation?: string // Only for 'found' items
  contactInfo: string
  image?: string
  createdAt: Date
}
