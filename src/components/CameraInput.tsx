import { useState } from 'react'

const CameraInput = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pb-2 sm:pb-4">
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
          <div className="flex items-center p-1.5">
            <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-green-500/90 rounded-full text-white hover:bg-green-600/90 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
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
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Take a photo or ask..."
              className="flex-grow bg-transparent text-white text-lg px-5 outline-none placeholder-gray-400/80 font-sans font-light"
            />
            <button
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
  )
}

export default CameraInput