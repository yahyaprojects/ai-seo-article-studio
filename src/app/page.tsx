import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import LightPillar from "@/components/ui/LightPillar";
import { ROUTES, UI_TEXT } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="grid gap-12">
      <div id="home-hero" className="relative left-1/2 right-1/2 -mx-[50vw] -mt-16 h-screen w-screen overflow-hidden">
        <div className="absolute inset-0">
          <LightPillar
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ff3a24"
            noiseIntensity={1.75}
            rotation={30}
            scale={0.2}
            speed={2}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/45" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,0,0.26),transparent_60%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center px-6">
          <div className="grid gap-6 text-center">
            <p className="text-xs tracking-[0.2em] text-white/70">{UI_TEXT.heroEyebrow}</p>
            <h1 className="bg-gradient-to-b from-white to-white/50 bg-clip-text font-heading text-5xl font-bold leading-tight text-transparent md:text-7xl">
              SaaS para crear demos de contenido SEO con IA
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/80 md:text-lg">
              Genera artículos completos, revisa una vista previa final y publica con un flujo editorial pensado para
              equipos.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href={ROUTES.login}>
                <Button className="inline-flex items-center gap-2">
                  <span>Acceder al panel</span>
                  <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button variant="ghost">Ver cómo funciona</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-16">
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="grid gap-3">
            <p className="text-sm text-muted-foreground">Generación estructurada</p>
            <h2 className="font-heading text-2xl font-semibold text-foreground">JSON SEO completo</h2>
            <p className="text-sm text-muted-foreground">
              Salida con metadata, schema, FAQ, enlaces internos e imagen destacada en un único flujo.
            </p>
          </Card>
          <Card className="grid gap-3">
            <p className="text-sm text-muted-foreground">Control editorial</p>
            <h2 className="font-heading text-2xl font-semibold text-foreground">Aprobación antes de publicar</h2>
            <p className="text-sm text-muted-foreground">
              El equipo revisa vista previa real del artículo y decide publicar o regenerar.
            </p>
          </Card>
          <Card className="grid gap-3">
            <p className="text-sm text-muted-foreground">Persistencia práctica</p>
            <h2 className="font-heading text-2xl font-semibold text-foreground">Guardado en filesystem</h2>
            <p className="text-sm text-muted-foreground">
              Artículos en borrador/publicados almacenados como JSON para uso interno y demos.
            </p>
          </Card>
        </section>

        <section id="como-funciona" className="grid gap-6">
          <h2 className="font-heading text-3xl font-semibold text-foreground">Cómo funciona en 4 pasos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="grid gap-2">
              <span className="text-xs text-muted-foreground">Paso 1</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">Brief editorial</h3>
              <p className="text-sm text-muted-foreground">
                El usuario introduce título, meta descripción y observaciones.
              </p>
            </Card>
            <Card className="grid gap-2">
              <span className="text-xs text-muted-foreground">Paso 2</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">Generación en streaming</h3>
              <p className="text-sm text-muted-foreground">
                Claude construye el artículo SEO y el JSON se muestra en tiempo real.
              </p>
            </Card>
            <Card className="grid gap-2">
              <span className="text-xs text-muted-foreground">Paso 3</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">Selección de imagen</h3>
              <p className="text-sm text-muted-foreground">
                Se elige imagen propuesta por IA o se sube una personalizada.
              </p>
            </Card>
            <Card className="grid gap-2">
              <span className="text-xs text-muted-foreground">Paso 4</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">Aprobación y publicación</h3>
              <p className="text-sm text-muted-foreground">
                El cliente aprueba y se publica con persistencia inmediata en el sistema.
              </p>
            </Card>
          </div>
        </section>

        <Card className="grid gap-4 rounded-xl border-border bg-card">
          <h2 className="font-heading text-3xl font-semibold text-foreground">¿Listo para ver el flujo completo?</h2>
          <p className="text-base text-muted-foreground">
            Inicia sesión y prueba el panel de generación, revisión y publicación de contenido.
          </p>
          <div>
            <Link href={ROUTES.login}>
              <Button>Ir a Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
