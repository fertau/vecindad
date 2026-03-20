export default function PublicProfilePage({ params }: { params: { uid: string } }) {
  return (
    <main className="min-h-screen px-5 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-primary mb-2">Perfil publico</h1>
        <div className="bg-white/60 rounded-xl border-2 border-dashed border-cream-dark p-8 text-center">
          <p className="text-primary/30 font-medium text-sm">
            Proximamente: perfil con nivel de confianza y conexiones mutuas
          </p>
        </div>
      </div>
    </main>
  )
}
