import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import CameraInput from './CameraInput'

interface CameraScreenProps {
  isVisible: boolean
  onBack: () => void
}

const CameraScreen = ({ isVisible, onBack }: CameraScreenProps) => {

  // Handle escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onBack()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, onBack])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-dvh flex flex-col">
        {/* Header with back button */}
        <div className="relative">
          <ChatHeader onMenuClick={() => {}} />
          <button
            onClick={onBack}
            className="absolute left-4 top-4 w-10 h-10 flex items-center justify-center bg-gray-800/80 rounded-full text-white hover:bg-gray-700/80 transition-all duration-200 backdrop-filter backdrop-blur-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-24">
            <MessageList />
          </div>
        </div>

        {/* Camera Input */}
        <CameraInput />

        {/* Camera preview overlay (optional) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

export default CameraScreen