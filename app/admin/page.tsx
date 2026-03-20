export default function AdminPage() {
  return (
    <main className="min-h-screen px-5 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-primary mb-2">Panel de administracion</h1>
        <p className="text-primary/40 mb-8">Verificacion de vecinos</p>
        <div className="bg-white/60 rounded-xl border-2 border-dashed border-cream-dark p-8 text-center">
          <p className="text-primary/30 font-medium text-sm">
            Proximamente: lista de vecinos pendientes de verificacion
          </p>
        </div>
      </div>
    </main>
  )
}
