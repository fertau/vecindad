export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen px-5 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-primary mb-2">Detalle de publicacion</h1>
        <div className="bg-white/60 rounded-xl border-2 border-dashed border-cream-dark p-8 text-center">
          <p className="text-primary/30 font-medium text-sm">
            Proximamente: vista de producto con vendedor y trust
          </p>
        </div>
      </div>
    </main>
  )
}
