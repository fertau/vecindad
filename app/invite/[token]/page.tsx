export default function InviteLandingPage({ params }: { params: { token: string } }) {
  return (
    <main>
      <h1>Invitación recibida</h1>
      <p>Token: {params.token}</p>
    </main>
  )
}
