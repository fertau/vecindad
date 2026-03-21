export default function AdminPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
          Panel de administracion
        </h1>
        <p className="text-on-surface-variant mb-10">Verificacion de vecinos</p>
        <div className="bg-surface-container-lowest rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 mb-4">admin_panel_settings</span>
          <p className="text-on-surface-variant font-medium text-sm">
            Proximamente: lista de vecinos pendientes de verificacion
          </p>
        </div>
      </div>
    </main>
  )
}
