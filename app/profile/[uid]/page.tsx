export default function PublicProfilePage({ params }: { params: { uid: string } }) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
          Perfil publico
        </h1>
        <div className="bg-surface-container-lowest rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 mb-4">person</span>
          <p className="text-on-surface-variant font-medium text-sm">
            Proximamente: perfil con nivel de confianza y conexiones mutuas
          </p>
        </div>
      </div>
    </main>
  )
}
