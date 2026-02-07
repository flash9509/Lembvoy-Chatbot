import React, { useState, useRef } from 'react'

interface ChatInputProps {
  onOpenCamera?: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ onOpenCamera }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false)

  const photosInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const toggleAttachmentMenu = () => {
    setIsAttachmentMenuOpen((prev) => !prev)
  }

  const closeAttachmentMenu = () => {
    setIsAttachmentMenuOpen(false)
  }

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
    closeAttachmentMenu()
  }

  const handlePhotosClick = () => {
    if (photosInputRef.current) {
      photosInputRef.current.click()
    }
    closeAttachmentMenu()
  }

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
    closeAttachmentMenu()
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4 relative">
          <div
            className={`transition-all duration-300 ease-in-out w-full max-w-3xl mx-auto rounded-full border ${
              isFocused ? 'border-emerald-400/80' : 'border-white/20'
            }`}
            style={{
              background: 'rgba(35, 35, 45, 0.8)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <div className="flex items-center p-1.5 relative">
              <button
                type="button"
                onClick={toggleAttachmentMenu}
                aria-label="Open attachment menu"
                className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-white transition-all duration-200 transform shadow-lg bg-green-500/90 hover:bg-green-600/90 focus:outline-none focus:ring-2 focus:ring-emerald-400/80 ${
                  isAttachmentMenuOpen ? 'scale-95 rotate-45' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Ask anything..."
                className="flex-grow bg-transparent text-white text-lg px-5 outline-none placeholder-gray-400/80 font-sans font-light"
              />
              <button
                type="button"
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-white transition-all duration-300 transform ${
                  inputValue
                    ? 'bg-green-500/90 hover:bg-green-600/90 scale-100'
                    : 'bg-gray-600/80 scale-90'
                } hover:scale-105 active:scale-95 shadow-lg`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 12h14m-7-7l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden inputs for attachments */}
      <input
        ref={photosInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
      />

      {/* Attachment menu overlay */}
      {isAttachmentMenuOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeAttachmentMenu}
          />

          <div className="relative w-full max-w-3xl mx-auto px-2 sm:px-4 pb-28">
            <div className="
              rounded-3xl border border-white/10
              bg-gradient-to-t
              from-gray-900/40
              via-gray-800/35
              to-gray-700/30
              backdrop-blur-xl
              shadow-2xl shadow-black/40
              overflow-hidden
        ">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between text-xs text-gray-400/90 uppercase tracking-[0.12em]">
                <span>Attach</span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span>Quick Actions</span>
                </span>
              </div>

              <div className="px-4 pb-3 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="group flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-400/60 transition-all duration-200 shadow-md shadow-black/40 active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 text-black shadow-lg shadow-emerald-500/50 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-100 tracking-wide">Camera</span>
                </button>

                <button
                  type="button"
                  onClick={handlePhotosClick}
                  className="group flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-400/60 transition-all duration-200 shadow-md shadow-black/40 active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/40 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.293-1.293A2 2 0 0117.414 12H20m-6-8H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-6-4z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-100 tracking-wide">Photos</span>
                </button>

                <button
                  type="button"
                  onClick={handleFileClick}
                  className="group flex flex-col items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-400/60 transition-all duration-200 shadow-md shadow-black/40 active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-100 text-slate-900 shadow-lg shadow-black/30 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0012.172 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v5a2 2 0 002 2h5"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-100 tracking-wide">File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatInput


