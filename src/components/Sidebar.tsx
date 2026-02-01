interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const conversationHistory = [
  "Plan my 5-day GOA trip 🌴",
  "Best cafés in Paris ☕",
  "Is Bali safe this month?",
  "Cheap flights to Dubai ✈️",
  "Hotels near Eiffel Tower 🏨",
  "Weekend getaway ideas",
  "Budget travel tips",
  "Local food recommendations",
  "Photography spots in Tokyo",
  "Hiking trails in Switzerland"
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div 
          className="h-full rounded-l-2xl border border-white/10 flex flex-col"
          style={{
            background: 'rgba(200,200,200,0.30)', // #7B7B7B but translucent
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.35)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-1 ml-6">
              <span className="text-white text-lg tracking-wide">L E M V</span>
              <span className="text-lg" style={{ filter: 'grayscale(100%)' }}>🌍</span>
              <span className="text-white text-lg">Y</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-6 pb-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 text-white transition-all duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Chat
            </button>
          </div>
          
          {/* Scrollable Chat History */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-1">
              {conversationHistory.map((conversation, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm group border border-transparent hover:border-white/20"
                >
                  <div className="truncate font-medium">{conversation}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}