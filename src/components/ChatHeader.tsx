interface ChatHeaderProps {
  onMenuClick: () => void
}

export default function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-center py-3 relative">
    <div className="flex items-center gap-1">
        <span className="text-white text-xl tracking-wide">L E M V</span>
        <span className="text-xl" style={{ filter: 'grayscale(100%)' }}>🌍</span>
        <span className="text-white text-xl">Y</span>
    </div>
    <button 
        onClick={onMenuClick}
        className="absolute right-4 h-10 w-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center" 
        aria-label="Menu"
    >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    </button>
    </div>

  )
}
