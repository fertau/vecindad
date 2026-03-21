export default function InviteLandingPage({ params }: { params: { token: string } }) {
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="max-w-sm text-center">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-8">
          <span
            className="material-symbols-outlined text-secondary text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            group_add
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
          Te invitaron a Vecindad
        </h1>
        <p className="text-on-surface-variant mb-10">
          Un vecino te invito al marketplace del barrio.
        </p>
        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center">
          <p className="text-on-surface-variant font-medium text-sm">
            Proximamente: registro por invitacion
          </p>
        </div>
      </div>
    </main>
  )
}
