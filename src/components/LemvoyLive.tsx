import { useEffect, useState, useRef } from 'react'

interface LemvoyLiveProps {
  isVisible: boolean
  onBack: () => void
}

const LemvoyLive = ({ isVisible, onBack }: LemvoyLiveProps) => {
  const [isMuted, setIsMuted] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [isCameraFlipped, setIsCameraFlipped] = useState(false)
  const [cameraPermissionState, setCameraPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
  const [microphonePermissionState, setMicrophonePermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Request camera and microphone access
  const requestPermissions = async () => {
    try {
      setCameraPermissionState('requesting')
      setMicrophonePermissionState('requesting')
      setErrorMessage('')
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera/microphone access not supported in this browser')
      }
      
      // First, let's enumerate available devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        const audioDevices = devices.filter(device => device.kind === 'audioinput')
        
        console.log('Total devices found:', devices.length)
        console.log('Video devices (cameras):', videoDevices.length)
        console.log('Audio devices (microphones):', audioDevices.length)
        console.log('Video devices:', videoDevices)
        console.log('Audio devices:', audioDevices)
        
        if (videoDevices.length === 0) {
          throw new Error('No camera devices found on this system')
        }
        
        if (audioDevices.length === 0) {
          throw new Error('No microphone devices found on this system')
        }
      } catch (enumerateError: any) {
        console.error('Device enumeration error:', enumerateError)
        throw new Error(`Could not detect devices: ${enumerateError.message}`)
      }
      
      // Check current permission status
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        
        console.log('Camera permission status:', cameraPermission.state)
        console.log('Microphone permission status:', microphonePermission.state)
        
        if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied') {
          throw new Error('Permissions have been permanently denied. Please enable them in browser settings.')
        }
      } catch (permissionError) {
        console.log('Permission query not supported or failed:', permissionError)
        // Continue with getUserMedia anyway
      }
      
      console.log('Requesting camera and microphone permissions...')
      console.log('Current URL:', window.location.href)
      console.log('Is HTTPS:', window.location.protocol === 'https:')
      console.log('Is localhost:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: isCameraFlipped ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      console.log('Permissions granted successfully')
      console.log('Video tracks:', mediaStream.getVideoTracks().length)
      console.log('Audio tracks:', mediaStream.getAudioTracks().length)
      
      // Set stream first, then update permission state
      // The useEffect will handle connecting the stream to the video element after render
      setStream(mediaStream)
      setCameraPermissionState('granted')
      setMicrophonePermissionState('granted')
    } catch (error: any) {
      console.error('Permission error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      
      // Handle specific error types
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Camera and microphone access denied. If you\'re using Brave browser, please check the shield icon in the address bar and allow camera/microphone access.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No camera or microphone found. Please make sure your devices are connected, not in use by other applications, and properly installed.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else if (error.name === 'NotReadableError') {
        setErrorMessage('Camera/microphone is being used by another application. Please close other apps using these devices.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else if (error.name === 'SecurityError') {
        setErrorMessage('Security error: Try using HTTPS or check if localhost permissions are enabled in your browser.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else if (error.message.includes('No camera devices found')) {
        setErrorMessage('No cameras detected on your system. Please connect a camera and refresh the page.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else if (error.message.includes('No microphone devices found')) {
        setErrorMessage('No microphones detected on your system. Please connect a microphone and refresh the page.')
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      } else {
        setErrorMessage(`Error accessing camera/microphone: ${error.message}`)
        setCameraPermissionState('denied')
        setMicrophonePermissionState('denied')
      }
    }
  }

  // Stop all media streams
  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  // Handle microphone toggle
  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  // Handle camera flip
  const flipCamera = async () => {
    setIsCameraFlipped(!isCameraFlipped)
    if (stream) {
      // Stop current stream and restart with flipped camera
      stopMediaStream()
      try {
        setCameraPermissionState('requesting')
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: !isCameraFlipped ? 'environment' : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })
        setStream(newStream)
        setCameraPermissionState('granted')
        if (videoRef.current) {
          videoRef.current.srcObject = newStream
          videoRef.current.onloadedmetadata = () => {
            console.log('Flipped camera metadata loaded, attempting to play...')
            videoRef.current?.play().then(() => {
              console.log('Flipped camera playing successfully')
            }).catch((playError) => {
              console.error('Flipped camera play error:', playError)
            })
          }
        }
      } catch (error) {
        console.error('Error flipping camera:', error)
        setCameraPermissionState('denied')
      }
    }
  }

  // Handle back navigation
  const handleBack = () => {
    stopMediaStream()
    onBack()
  }

  // Reset states when component becomes visible
  useEffect(() => {
    if (isVisible) {
      // Reset to initial state
      setCameraPermissionState('idle')
      setMicrophonePermissionState('idle')
      setErrorMessage('')
    } else {
      // Cleanup when not visible
      stopMediaStream()
    }
  }, [isVisible])

  // Handle escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleBack()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  // Connect stream to video element AFTER the video element renders
  useEffect(() => {
    if (stream && cameraPermissionState === 'granted' && videoRef.current) {
      console.log('useEffect: Connecting stream to video element')
      console.log('Stream active:', stream.active)
      console.log('Video tracks:', stream.getVideoTracks().length)
      
      videoRef.current.srcObject = stream
      
      // Play the video
      videoRef.current.play()
        .then(() => {
          console.log('Video playing successfully!')
          console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
        })
        .catch((err) => {
          console.error('Video play failed:', err)
        })
    }
  }, [stream, cameraPermissionState])

  if (!isVisible) return null

  // Show initial permission request screen
  if (cameraPermissionState === 'idle' || cameraPermissionState === 'requesting') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Start Lemvoy Live</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Lemvoy needs access to your camera and microphone to provide real-time visual assistance. 
            Your privacy is protected - no data is stored.
          </p>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Camera access for visual understanding</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Microphone for voice interaction</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-gray-600/80 hover:bg-gray-500/80 rounded-xl text-white transition-colors duration-200"
              disabled={cameraPermissionState === 'requesting'}
            >
              Cancel
            </button>
            <button
              onClick={requestPermissions}
              disabled={cameraPermissionState === 'requesting'}
              className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 disabled:opacity-50 rounded-xl text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {cameraPermissionState === 'requesting' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Requesting...
                </>
              ) : (
                'Allow Access'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show permission denied screen
  if (cameraPermissionState === 'denied' || microphonePermissionState === 'denied') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Permission Required</h2>
          {errorMessage ? (
            <p className="text-red-300 mb-4 text-sm leading-relaxed">{errorMessage}</p>
          ) : (
            <p className="text-gray-300 mb-6 leading-relaxed">
              Camera and microphone access is required for Lemvoy Live. Please enable permissions in your browser and try again.
            </p>
          )}
          
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-300 mb-3 font-medium">Device Not Found - Try these steps:</p>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• <strong>Check connections:</strong> Make sure your camera/microphone is plugged in</li>
              <li>• <strong>Close other apps:</strong> Quit Zoom, Teams, Skype, OBS, or other apps using camera/mic</li>
              <li>• <strong>Restart browser:</strong> Close and reopen Brave completely</li>
              <li>• <strong>Check device manager:</strong> Make sure drivers are installed (Windows: Device Manager)</li>
              <li>• <strong>Test elsewhere:</strong> Try opening camera in another app first</li>
            </ul>
            
            <p className="text-sm text-gray-300 mb-2 mt-4 font-medium">For Brave Browser:</p>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• Go to <strong>brave://settings/content/camera</strong></li>
              <li>• Go to <strong>brave://settings/content/microphone</strong></li>
              <li>• Make sure these aren't blocked globally</li>
              <li>• Click the shield icon in address bar and allow devices</li>
            </ul>
            
            <div className="mt-3 p-2 bg-red-900/30 rounded text-xs text-red-200">
              <strong>Current Issue:</strong> No camera/microphone devices detected by browser.
            </div>
            
            <div className="mt-2 p-2 bg-blue-900/30 rounded text-xs text-blue-200">
              <strong>Debug Info:</strong> Check browser console (F12) to see device count.
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-gray-600/80 hover:bg-gray-500/80 rounded-xl text-white transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setCameraPermissionState('idle')
                setMicrophonePermissionState('idle')
                setErrorMessage('')
              }}
              className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          transform: isCameraFlipped ? 'scaleX(-1)' : 'scaleX(1)',
          backgroundColor: '#000'
        }}
        onError={(e) => {
          console.error('Video element error:', e)
        }}
        onPlay={() => {
          console.log('Video started playing')
        }}
        onLoadStart={() => {
          console.log('Video load started')
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div 
          className="flex items-center justify-between p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Lemvoy Live</span>
          </div>

          {/* Captions Toggle */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-200 backdrop-blur-sm ${
              showCaptions ? 'bg-emerald-500/80 hover:bg-emerald-600/80' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0v2a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Captions Area */}
      {showCaptions && (
        <div className="absolute bottom-24 left-4 right-4 z-10">
          <div 
            className="rounded-2xl px-4 py-3 min-h-[60px] flex items-center"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-white text-center w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`w-1 h-1 rounded-full animate-pulse ${isMuted ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  {isMuted ? 'Microphone Off' : 'Listening'}
                </span>
                <div className={`w-1 h-1 rounded-full animate-pulse ${isMuted ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
              </div>
              <p className="text-sm opacity-70">
                {isMuted ? 'Tap microphone to speak...' : 'Speak naturally about what you see...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div 
          className="flex items-center justify-center gap-8 p-6"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }}
        >
          {/* Mute Button */}
          <button
            onClick={toggleMicrophone}
            className={`w-14 h-14 flex items-center justify-center rounded-full text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
              isMuted ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-emerald-500/80 hover:bg-emerald-600/80'
            }`}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMuted ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>

          {/* Camera Flip Button */}
          <button
            onClick={flipCamera}
            className="w-14 h-14 flex items-center justify-center rounded-full text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-white/20 hover:bg-white/30"
            aria-label="Flip camera"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* End Session Button */}
          <button
            onClick={handleBack}
            className="w-14 h-14 flex items-center justify-center rounded-full text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg bg-red-500/80 hover:bg-red-600/80"
            aria-label="End session"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LemvoyLive