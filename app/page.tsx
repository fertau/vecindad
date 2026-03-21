'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold mb-6">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span>COMUNIDAD EXCLUSIVA</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight mb-8">
              El marketplace de tu barrio.{' '}
              <span className="text-secondary italic">Solo vecinos verificados.</span>
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-lg leading-relaxed">
              Recuperamos la confianza de comprarle a quien vive cerca. Sin envios costosos, sin
              extranos, solo la calidez de tu vecindario.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {!loading && !user && (
                <Link
                  href="/auth"
                  className="bg-signature-gradient text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 text-center"
                >
                  Unite a Nordelta
                </Link>
              )}
              {!loading && user && (
                <Link
                  href="/publish"
                  className="bg-signature-gradient text-white px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 text-center"
                >
                  Publicar ahora
                </Link>
              )}
              <Link
                href="/feed"
                className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-full text-lg font-bold hover:bg-surface-container-high transition-all text-center"
              >
                Ver listados
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="aspect-square bg-surface-container-low rounded-[3rem] overflow-hidden rotate-3 relative group">
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[120px] text-outline-variant/30"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  park
                </span>
              </div>
              <div className="absolute bottom-6 left-6 bg-surface-bright/80 backdrop-blur-xl p-4 rounded-xl shadow-lg max-w-[200px]">
                <p className="text-xs font-bold text-primary-container uppercase tracking-widest mb-1">
                  Ultima actividad
                </p>
                <p className="text-sm font-medium">
                  Martin de la calle 4 vendio una bicicleta hoy
                </p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-container rounded-full mix-blend-multiply opacity-50 blur-3xl" />
          </div>
        </div>
      </section>

      {/* ─── Trust System Section ─── */}
      <section className="bg-surface-container-low py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
              Confianza de mano en mano
            </h2>
            <p className="text-on-surface-variant text-lg">
              Creamos un entorno seguro para que vuelvas a confiar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TrustCard
              icon="shield_person"
              iconBg="bg-primary-fixed"
              iconColor="text-primary"
              title="Vecinos Verificados"
              description="Validamos la identidad y domicilio de cada miembro para asegurar que todos somos quienes decimos ser."
            />
            <div className="bg-surface-container-lowest p-10 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/20 rounded-bl-full" />
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6">
                <span
                  className="material-symbols-outlined text-secondary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  handshake
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">Reputacion Local</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Basada en transacciones reales y recomendaciones directas de tus propios vecinos.
              </p>
            </div>
            <TrustCard
              icon="groups"
              iconBg="bg-tertiary-fixed"
              iconColor="text-tertiary"
              title="Conexiones Mutuas"
              description="Mira que amigos o conocidos tienen en comun antes de concretar una compra o servicio."
            />
          </div>
        </div>
      </section>

      {/* ─── Bento Grid: Community Feed ─── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight italic leading-tight">
                Lo que esta pasando ahora en tu barrio.
              </h2>
              <p className="text-on-surface-variant text-lg">
                Desde tesoros usados hasta talentos locales, todo a la vuelta de la esquina.
              </p>
            </div>
            <Link href="/feed" className="text-primary font-bold flex items-center gap-2 hover:underline">
              Ver todas las publicaciones{' '}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/* Item 1: Wide — Bicicleta */}
            <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-4 flex flex-col group overflow-hidden">
              <div className="relative h-64 md:h-full overflow-hidden rounded-2xl bg-surface-container-low">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[80px] text-outline-variant/30">pedal_bike</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Ayer
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-primary mb-1">Bicicleta rodado 20</h3>
                <p className="text-on-surface-variant text-sm mb-4">
                  &quot;Casi nueva, solo 6 meses de uso. Se entrega en el club house.&quot;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-secondary">$145.000</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Ana G.</span>
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest" />
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2: Tall — Jardineria */}
            <div className="md:row-span-2 bg-surface-container-highest rounded-3xl p-6 flex flex-col justify-between group">
              <div>
                <span
                  className="material-symbols-outlined text-4xl text-primary mb-6"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                <h3 className="text-2xl font-bold mb-4">Servicio de Jardineria</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  &quot;Especialista en podas y diseno de cercos vivos. Conozco perfectamente el
                  suelo de Nordelta.&quot;
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex -space-x-3 overflow-hidden">
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-surface-container" />
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-surface-container-high" />
                  <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-surface-container-highest" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white text-xs font-bold">
                    +12
                  </div>
                </div>
                <p className="text-sm font-bold text-secondary">Recomendado por 15 vecinos</p>
                <button className="w-full bg-whatsapp-gradient text-white py-4 rounded-full flex items-center justify-center gap-3 font-bold active:scale-95 transition-all">
                  <span className="material-symbols-outlined">chat</span> WhatsApp
                </button>
              </div>
            </div>

            {/* Item 3: Square — Torta */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-[60px] text-outline-variant/30">cake</span>
              </div>
              <h3 className="font-bold text-primary">Torta casera para eventos</h3>
              <p className="text-xs text-on-surface-variant mt-1">Por Laura B. (Barrio El Golf)</p>
            </div>

            {/* Item 4: Bottom Wide — CTA Publicar */}
            <div className="md:col-span-2 bg-primary text-white rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
              <div className="z-10">
                <h3 className="text-3xl font-bold mb-4">Tenes algo para vender?</h3>
                <p className="text-primary-fixed-dim mb-8 max-w-sm">
                  Tus vecinos lo estan buscando. Publicar es gratis y solo toma un minuto.
                </p>
                <Link
                  href={user ? '/publish' : '/auth'}
                  className="inline-block bg-surface-bright text-primary px-8 py-3 rounded-full font-bold hover:bg-white transition-all"
                >
                  Publicar ahora
                </Link>
              </div>
              <span
                className="material-symbols-outlined absolute -bottom-8 -right-8 text-[200px] opacity-10 rotate-12"
              >
                storefront
              </span>
            </div>

            {/* Item 5: Small Square — Reparacion */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 flex flex-col">
              <div className="bg-tertiary-fixed h-32 rounded-2xl mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-4xl">handyman</span>
              </div>
              <h3 className="font-bold text-primary">Reparacion de PCs</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                &quot;Vengo a domicilio, sin cargo de visita.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-surface-container-low py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-secondary font-bold uppercase tracking-[0.2em] text-sm">
              Testimonios Realmente Cercanos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 tracking-tight">
              Historias de la Vecindad
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] relative">
              <span className="material-symbols-outlined text-6xl text-secondary-container absolute -top-4 -left-4">
                format_quote
              </span>
              <p className="text-xl text-on-surface leading-relaxed italic mb-8 relative z-10">
                &quot;Buscaba una bici para mi hijo y la encontre a tres cuadras de casa. El trato
                fue increible y me senti segura sabiendo que le compraba a una vecina del mismo
                barrio.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-surface-container-highest" />
                <div>
                  <p className="font-bold">Valeria M.</p>
                  <p className="text-sm text-on-surface-variant italic">Vecina de Los Castores</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] relative">
              <span className="material-symbols-outlined text-6xl text-primary-fixed absolute -top-4 -left-4">
                format_quote
              </span>
              <p className="text-xl text-on-surface leading-relaxed italic mb-8 relative z-10">
                &quot;Ofrezco mis servicios de carpinteria y el 90% de mis clientes ahora vienen de
                Vecindad. Es mucho mas facil coordinar cuando estas a 5 minutos de distancia.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-surface-container-highest" />
                <div>
                  <p className="font-bold">Jorge L.</p>
                  <p className="text-sm text-on-surface-variant italic">Vecino de El Yacht</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WhatsApp CTA ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-whatsapp-gradient rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Dudas? Chatea con nosotros
            </h2>
            <p className="text-xl text-secondary-fixed opacity-90 mb-10 max-w-xl mx-auto">
              Nuestro equipo de soporte (tambien vecinos) esta disponible por WhatsApp para
              ayudarte a verificar tu cuenta o subir tu primer anuncio.
            </p>
            <button className="bg-surface-bright text-secondary px-12 py-5 rounded-full text-xl font-bold flex items-center gap-4 mx-auto hover:scale-105 transition-all shadow-lg active:scale-95">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
              Contactar via WhatsApp
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-primary text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span
                className="material-symbols-outlined text-secondary-fixed text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <span className="text-3xl font-black tracking-tight">Vecindad</span>
            </div>
            <p className="text-primary-fixed-dim text-lg max-w-sm leading-relaxed">
              Transformando barrios en comunidades conectadas a traves de la confianza y el
              comercio local.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">Explorar</h4>
            <ul className="space-y-4 text-primary-fixed-dim">
              <li><Link href="/feed" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="/feed?cat=services" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Comunidad</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Seguridad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">Legal</h4>
            <ul className="space-y-4 text-primary-fixed-dim">
              <li><Link href="/" className="hover:text-white transition-colors">Terminos</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Normas del Barrio</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-primary-fixed-dim text-sm">
          <p>2024 Vecindad Marketplace. Hecho con amor para Nordelta.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">Facebook</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TrustCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: string
  iconBg: string
  iconColor: string
  title: string
  description: string
}) {
  return (
    <div className="bg-surface-container-lowest p-10 rounded-2xl flex flex-col items-center text-center">
      <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mb-6`}>
        <span
          className={`material-symbols-outlined ${iconColor} text-3xl`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  )
}
