import { Post, PostType } from '@/types/post';
import { User } from '@/types/user';

// API URL - Update this to your production URL when deploying
const API_URL = 'http://localhost:5000/api';

// Helper to get stored auth token
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

// Post API calls
export const fetchPosts = async (
  type?: PostType,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; totalPages: number; currentPage: number; totalPosts: number }> => {
  let url = `${API_URL}/posts?page=${page}&limit=${limit}`;
  if (type) {
    // Capitalize the first letter of the type to match backend format
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    url += `&type=${capitalizedType}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert backend post format to frontend format
    const posts = data.posts.map((post: any) => ({
      id: post._id,
      type: post.type.toLowerCase() as PostType,
      title: post.title,
      description: post.description,
      location: post.location,
      currentLocation: post.currentLocation,
      contactInfo: post.contactInfo,
      image: post.imageUrl,
      createdAt: new Date(post.createdAt)
    }));
    
    return {
      posts,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalPosts: data.totalPosts
    };
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  
  const post = await response.json();
  
  return {
    id: post._id,
    type: post.type.toLowerCase() as PostType,
    title: post.title,
    description: post.description,
    location: post.location,
    currentLocation: post.currentLocation,
    contactInfo: post.contactInfo,
    image: post.imageUrl,
    createdAt: new Date(post.createdAt)
  };
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const authHeader = getAuthHeader();
  
  // Don't include Content-Type when using FormData, browser will set it with boundary
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: authHeader,
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create post');
  }
  
  const post = await response.json();
  
  return {
    id: post._id,
    type: post.type.toLowerCase() as PostType,
    title: post.title,
    description: post.description,
    location: post.location,
    currentLocation: post.currentLocation,
    contactInfo: post.contactInfo,
    image: post.imageUrl,
    createdAt: new Date(post.createdAt)
  };
};

export const updatePost = async (id: string, formData: FormData): Promise<Post> => {
  const authHeader = getAuthHeader();
  
  // Don't include Content-Type when using FormData, browser will set it with boundary
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: authHeader,
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update post');
  }
  
  const post = await response.json();
  
  return {
    id: post._id,
    type: post.type.toLowerCase() as PostType,
    title: post.title,
    description: post.description,
    location: post.location,
    currentLocation: post.currentLocation,
    contactInfo: post.contactInfo,
    image: post.imageUrl,
    createdAt: new Date(post.createdAt)
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const authHeader = getAuthHeader();
  
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete post');
  }
}; 