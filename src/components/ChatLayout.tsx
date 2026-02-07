import { useState, useRef, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import Sidebar from './Sidebar'
import CameraScreen from './CameraScreen'

export default function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCameraScreenOpen, setIsCameraScreenOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const openCameraScreen = () => {
    setIsCameraScreenOpen(true)
  }

  const closeCameraScreen = () => {
    setIsCameraScreenOpen(false)
  }

  // Handle touch events for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isRightSwipe = distanceX < -50 // Swipe right
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)
    
    // Only trigger on horizontal right swipes (not vertical swipes)
    if (isRightSwipe && !isVerticalSwipe) {
      // Check if we're on mobile (screen width less than 768px)
      if (window.innerWidth < 768) {
        openCameraScreen()
      }
    }
  }

  // Prevent body scroll when camera screen is open
  useEffect(() => {
    if (isCameraScreenOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isCameraScreenOpen])

  return (
    <>
      <div 
        ref={containerRef}
        className="h-dvh flex justify-center chat-background overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full md:max-w-3xl h-full flex flex-col text-white relative">
          <ChatHeader onMenuClick={toggleSidebar} />
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <MessageList />
          </div>
          <ChatInput onOpenCamera={openCameraScreen} />
        </div>
        
        {/* Swipe hint for mobile */}
        <div className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 opacity-30 animate-pulse">
          <div className="flex items-center text-white/60 text-xs">
            <span className="mr-1">📷</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
        
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>
      
      {/* Camera Screen */}
      <CameraScreen 
        isVisible={isCameraScreenOpen} 
        onBack={closeCameraScreen} 
      />
    </>
  )
}
