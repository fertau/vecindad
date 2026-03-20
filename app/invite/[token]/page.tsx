export default function InviteLandingPage({ params }: { params: { token: string } }) {
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-5">
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-primary mb-2">Te invitaron a Vecindad</h1>
        <p className="text-primary/40 mb-8 text-sm">
          Un vecino te invito al marketplace del barrio.
        </p>
        <div className="bg-white/60 rounded-xl border-2 border-dashed border-cream-dark p-6 text-center">
          <p className="text-primary/30 font-medium text-sm">
            Proximamente: registro por invitacion
          </p>
        </div>
      </div>
    </main>
  )
}
