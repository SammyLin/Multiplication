import type { ReactNode } from 'react'

export type MascotProfile = {
  id: string
  name: string
  title: string
  subtitle: string
  gradient: string
  greeting: string
  encourage: string
  celebrate: string
  celebratePerfect: string
  svg: ReactNode
}

type CuteMascotsProps = {
  mascots: MascotProfile[]
  selectedId?: string | null
  onSelect: (id: string) => void
}

const CuteMascots = ({ mascots, selectedId, onSelect }: CuteMascotsProps) => (
  <section
    className="grid gap-4 rounded-hero bg-white/80 p-4 shadow-soft md:grid-cols-3"
    data-testid="mul-cute-mascots"
  >
    {mascots.map((mascot) => (
      <button
        key={mascot.id}
        type="button"
        onClick={() => onSelect(mascot.id)}
        className={`relative overflow-hidden rounded-hero border-2 p-0 text-left transition duration-300 ease-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-sunrise/40 ${
          selectedId === mascot.id
            ? 'border-sunrise shadow-[0_12px_28px_rgba(255,159,28,0.35)]'
            : 'border-transparent hover:border-sunrise/60 hover:shadow-soft'
        }`}
        data-testid={`mul-mascot-${mascot.id}`}
      >
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${mascot.gradient}`} aria-hidden="true" />
        <div className="relative overflow-hidden p-4">
          <MascotBackdrop gradient={mascot.gradient} />
          <div className="relative mb-3 flex items-center justify-center">
            <div className={`animate-mascot-float ${selectedId === mascot.id ? 'scale-105' : ''}`}>
              {mascot.svg}
            </div>
          </div>
          <h3 className="text-center text-lg font-display text-midnight">{mascot.title}</h3>
          <p className="mt-1 text-center text-sm text-midnight/70">{mascot.subtitle}</p>
        </div>
      </button>
    ))}
  </section>
)

const MascotBackdrop = ({ gradient }: { gradient: string }) => (
  <>
    <span className={`mascot-glow -left-10 top-6 h-24 w-24 bg-gradient-to-br ${gradient}`} aria-hidden="true" />
    <span className={`mascot-glow right-[-18px] bottom-2 h-20 w-20 bg-gradient-to-tr ${gradient}`} aria-hidden="true" style={{ animationDelay: '1.5s' }} />
    <span className="mascot-bubble left-6 top-6 h-6 w-6" aria-hidden="true" style={{ animationDelay: '0.7s' }} />
    <span className="mascot-bubble right-12 bottom-8 h-4 w-4" aria-hidden="true" style={{ animationDelay: '1.2s' }} />
    <span className="mascot-bubble left-[55%] top-10 h-3 w-3" aria-hidden="true" style={{ animationDelay: '2.1s' }} />
  </>
)

export default CuteMascots
