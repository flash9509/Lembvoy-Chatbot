type Props = {
  image?: string
  title: string
}

export default function MessageCard({ image = '/Image.png', title }: Props) {
  return (
    <article className="group relative max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_25px_60px_-45px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur transition-opacity duration-300 group-hover:opacity-100 opacity-80">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Featured pick
        </span>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40" aria-hidden>
          <div className="absolute -left-12 -top-16 h-40 w-40 rotate-12 bg-gradient-to-br from-white/50 via-white/20 to-transparent blur-3xl" />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-white text-base font-semibold leading-snug">{title}</p>
      </div>
    </article>
  ) 
}