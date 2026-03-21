import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-outline-variant/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-primary mb-2">Pagina no encontrada</h1>
        <p className="text-on-surface-variant mb-10">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-signature-gradient text-white font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all active:scale-95"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
