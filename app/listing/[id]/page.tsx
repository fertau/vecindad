export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Detalle de publicación</h1>
      <p>ID: {params.id}</p>
    </main>
  )
}
