type Props = {
  role: 'user' | 'bot'
  children: React.ReactNode
}

export default function MessageBubble({ role, children }: Props) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[78%] md:max-w-[72%] rounded-2xl px-4 py-3 text-[0.98rem] leading-relaxed shadow-[0_20px_60px_-45px_rgba(0,0,0,1)] backdrop-blur-sm border
          ${isUser
            ? 'bg-gradient-to-br from-neutral-200/5 via-neutral-900/30 to-neutral-900/70 border-neutral-700 text-white'
            : 'bg-white/4 border-white/10 text-white'
          }`}
      >
        <div className="absolute -left-7 top-2 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] uppercase tracking-wide text-white/70">
          {isUser ? 'You' : 'AI'}
        </div>
        {children}
      </div>
    </div>
  )
}
