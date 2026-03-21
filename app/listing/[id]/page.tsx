'use client'

import Link from 'next/link'

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  // Placeholder data — will be replaced with Firestore query in Session 3
  return (
    <main className="max-w-4xl mx-auto pb-32">
      {/* Product Hero */}
      <section className="p-6">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low">
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-outline-variant/30">image</span>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Como nueva
            </span>
          </div>
        </div>
      </section>

      {/* Product Details & Social Proof */}
      <section className="px-6 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                Bicicleta Rodado 16
              </h1>
              <p className="text-on-surface-variant font-medium">
                Bici de ninos - 2 anos de uso
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">$120</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-highest" />
              <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high" />
            </div>
            <p className="text-sm font-semibold text-on-surface">
              <span className="text-primary">2 vecinos en comun</span>
            </p>
          </div>
        </div>

        {/* Seller Profile */}
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Elena Rodriguez</h3>
                <div className="flex items-center gap-1 text-secondary text-sm font-bold">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                  Vecino Verificado
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">thumb_up</span>
              Aval de vecino
            </button>
          </div>

          <p className="text-on-surface-variant leading-relaxed">
            &quot;A mi hijo le quedo chica mas rapido de lo esperado. Ha estado guardada en
            nuestro garage y bien mantenida. Ideal para ninos de 4 a 6 anos.&quot;
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container flex items-center gap-3 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <div className="text-xs">
                <p className="text-on-surface-variant font-medium">Punto de encuentro</p>
                <p className="font-bold text-on-surface">Plaza del barrio</p>
              </div>
            </div>
            <div className="bg-surface-container flex items-center gap-3 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <div className="text-xs">
                <p className="text-on-surface-variant font-medium">Activa generalmente</p>
                <p className="font-bold text-on-surface">Despues de las 17:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-primary">Detalles</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
              <p className="text-on-surface-variant">Cuadro de aluminio liviano para un facil manejo.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
              <p className="text-on-surface-variant">Ruedas de entrenamiento removibles incluidas.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
              <p className="text-on-surface-variant">Freno contrapedal para una parada confiable.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <div className="fixed bottom-24 left-0 w-full px-6 z-40 md:static md:px-6 md:mt-12">
        <div className="bg-surface-bright/80 backdrop-blur-xl p-4 rounded-2xl flex gap-3 shadow-[0_-4px_24px_rgba(28,28,23,0.06)] ghost-border">
          <button className="flex-1 bg-whatsapp text-white py-4 rounded-full font-bold text-lg flex justify-center items-center gap-3 hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined">chat</span>
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </main>
  )
}
