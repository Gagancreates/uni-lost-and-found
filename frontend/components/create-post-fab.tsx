"use client"

import { Plus } from "lucide-react"

interface CreatePostFABProps{
    onClick(): void
}
export default function CreatePostFAB({onClick}: CreatePostFABProps){
    return(
        <button onClick={onClick} className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gray-800 text-white shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
            <Plus size={30} />
        </button>
    )
}
