import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-5">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-primary/10 mb-4">404</p>
        <h1 className="text-xl font-bold text-primary mb-2">Pagina no encontrada</h1>
        <p className="text-sm text-primary/40 mb-8">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-light transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
