export default function PublicProfilePage({ params }: { params: { uid: string } }) {
  return (
    <main>
      <h1>Perfil público</h1>
      <p>UID: {params.uid}</p>
    </main>
  )
}
