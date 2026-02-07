import { useState, useRef, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import Sidebar from './Sidebar'
import CameraScreen from './CameraScreen'

export default function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCameraScreenOpen, setIsCameraScreenOpen] = useState(false)
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
      >
        <div className="w-full md:max-w-3xl h-full flex flex-col text-white relative">
          <ChatHeader onMenuClick={toggleSidebar} />
          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            <MessageList />
          </div>
          <ChatInput onOpenCamera={openCameraScreen} />
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
