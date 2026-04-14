import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES, UI_TEXT } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="grid gap-8 md:gap-12">
      <Card className="grid gap-8 rounded-xl p-8 md:p-10">
        <div className="inline-flex w-fit rounded-sm bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {UI_TEXT.heroEyebrow}
        </div>
        <div className="grid gap-4">
          <h1 className="font-heading text-4xl font-bold text-hero-text md:text-6xl">
            Plataforma SaaS para generar y publicar contenido SEO con IA
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
            Automatiza el ciclo editorial completo: generación asistida por IA, vista previa para aprobación,
            selección de imagen y publicación final en formato listo para producción.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={ROUTES.login}>
            <Button>Acceder al panel</Button>
          </Link>
          <a href="#como-funciona">
            <Button variant="ghost">Ver cómo funciona</Button>
          </a>
        </div>
      </Card>

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
    </section>
  );
}
