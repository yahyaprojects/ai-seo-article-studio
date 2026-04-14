import Link from "next/link";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiImage,
  FiLayers,
  FiSearch,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import LightPillar from "@/components/ui/LightPillar";
import { ROUTES } from "@/lib/constants";

const features = [
  {
    icon: FiCpu,
    eyebrow: "IA Generativa",
    title: "Claude AI en tiempo real",
    description:
      "Streaming carácter a carácter con Claude claude-sonnet-4. El JSON SEO completo se construye en vivo frente al editor sin esperas.",
  },
  {
    icon: FiCode,
    eyebrow: "Salida estructurada",
    title: "JSON SEO completo",
    description:
      "Metadata, schema JSON-LD, FAQ, H1/H2/H3, enlaces internos e imagen destacada en un único flujo validado contra 14 criterios.",
  },
  {
    icon: FiImage,
    eyebrow: "Optimización automática",
    title: "Conversión WebP nativa",
    description:
      "PNG, JPG y GIF se convierten en WebP con canvas antes de almacenarse. Ahorro de peso visible y checklist SEO que verifica el formato.",
  },
  {
    icon: FiSearch,
    eyebrow: "Validación automatizada",
    title: "Auditoría SEO en 14 puntos",
    description:
      "Checklist animado con puntuación 0-100: keywords, meta tags, OG, schema markup, slug, FAQ, alt texts y formato WebP.",
  },
  {
    icon: FiLayers,
    eyebrow: "Control editorial",
    title: "Aprobación antes de publicar",
    description:
      "Vista previa real del artículo final antes de publicar. El equipo aprueba, regenera o mejora el SEO con un clic.",
  },
  {
    icon: FiShield,
    eyebrow: "Persistencia práctica",
    title: "Sin base de datos",
    description:
      "Artículos guardados como JSON en filesystem. Ideal para demos, pruebas de concepto y flujos editoriales sin infraestructura adicional.",
  },
];

const steps = [
  {
    num: "01",
    title: "Brief editorial",
    desc: "Introduce título, meta descripción y observaciones. Validación de duplicados automática antes de generar.",
    detail: "Validación en tiempo real",
  },
  {
    num: "02",
    title: "Streaming con Claude",
    desc: "Claude genera el JSON SEO completo con streaming en vivo. Cada token aparece al instante en el panel de preview.",
    detail: "~4 000 tokens / 8 s",
  },
  {
    num: "03",
    title: "Imagen → WebP",
    desc: "Las imágenes propuestas por IA se convierten a WebP vía proxy al terminar la generación. Las subidas se convierten con canvas.",
    detail: "Hasta 80 % menos peso",
  },
  {
    num: "04",
    title: "Auditar y publicar",
    desc: "14 criterios SEO validados automáticamente. Perfecciona con IA si es necesario y publica con persistencia inmediata.",
    detail: "Score SEO 0-100",
  },
];

const seoChecks = [
  { label: "Meta title ≤ 60 caracteres", pass: true },
  { label: "Meta description ≤ 160 caracteres", pass: true },
  { label: "Keyword principal en título, H1 y meta", pass: true },
  { label: "Slug optimizado (≤ 60 chars)", pass: true },
  { label: "≥ 3 secciones H2", pass: true },
  { label: "FAQ para featured snippets", pass: true },
  { label: "OG Title y OG Description", pass: true },
  { label: "Schema JSON-LD (Article)", pass: true },
  { label: "≥ 3 sugerencias de enlaces internos", pass: true },
  { label: "Alt texts en imágenes", pass: true },
  { label: "Imagen destacada en formato WebP", pass: false },
];

const stats = [
  { value: "14", label: "Criterios SEO" },
  { value: "WebP", label: "Formato imagen" },
  { value: "< 8 s", label: "Generación" },
  { value: "100", label: "Score máximo" },
];

const techStack = [
  "Claude AI",
  "Next.js 15",
  "WebP Optimizer",
  "JSON-LD Schema",
  "Streaming API",
  "Filesystem Storage",
];

export default function HomePage() {
  return (
    <section className="grid gap-0">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        id="home-hero"
        className="relative left-1/2 right-1/2 -mx-[50vw] -mt-16 min-h-screen w-screen overflow-hidden"
      >
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
        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-black/52" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,0,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,58,36,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,58,36,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 pb-20 pt-28 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Demo SEO · Powered by Claude AI
          </span>

          <h1 className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text font-heading text-5xl font-bold leading-tight text-transparent md:text-7xl lg:text-8xl">
            Contenido SEO
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
              generado por IA
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/70 md:text-xl">
            Genera artículos SEO completos en tiempo real con Claude AI. Conversión automática de imágenes a WebP,
            auditoría en 14 puntos y flujo editorial con vista previa antes de publicar.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href={ROUTES.login}>
              <Button className="inline-flex items-center gap-2 px-6 py-3 text-base">
                <MdAutoAwesome className="h-4 w-4" aria-hidden />
                Acceder al panel
                <FiArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="ghost" className="px-6 py-3 text-base text-white/70 hover:text-white">
                Ver cómo funciona
              </Button>
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm"
              >
                <p className="font-heading text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-6xl gap-20 px-6 pb-24 pt-10">

        {/* ── Tech strip ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-45">
          {techStack.map((tech) => (
            <span key={tech} className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>

        {/* ── Features ── */}
        <section className="grid gap-8">
          <div className="grid gap-2 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Capacidades</p>
            <h2 className="font-heading text-4xl font-bold text-foreground">
              Todo lo que necesitas para SEO con IA
            </h2>
            <p className="mx-auto max-w-xl text-base text-muted-foreground">
              De la generación a la publicación, con auditoría automática y optimización de imágenes incluida.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, eyebrow, title, description }) => (
              <Card
                key={title}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative grid gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
                  <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="como-funciona" className="grid gap-8">
          <div className="grid gap-2 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Flujo editorial</p>
            <h2 className="font-heading text-4xl font-bold text-foreground">
              De la idea al artículo publicado en 4 pasos
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ num, title, desc, detail }) => (
              <Card
                key={num}
                className="group grid gap-3 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-primary/30 transition-colors group-hover:text-primary/60">
                    {num}
                  </span>
                  <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-xs text-primary">
                    {detail}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── WebP optimisation highlight ── */}
        <section className="overflow-hidden rounded-2xl border border-border bg-secondary/20">
          <div className="grid md:grid-cols-2">
            <div className="grid gap-5 p-8 md:p-12">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                <FiImage className="h-3.5 w-3.5" /> Optimización de imágenes
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Conversión automática
                <br />
                <span className="text-primary">a WebP en tiempo real</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cada imagen subida o seleccionada desde la IA se convierte al formato WebP — el estándar moderno para
                rendimiento web — antes de almacenarse. Ahorra hasta un 80 % de peso con la misma calidad visual.
              </p>
              <ul className="grid gap-2">
                {[
                  "Barra de progreso con fases: Leyendo → WebP → Optimizando",
                  "Comparativa de tamaño antes / después en tiempo real",
                  "PNG, JPG, GIF → WebP vía Canvas API",
                  "Imágenes web convertidas en background vía proxy",
                  "Checklist SEO verifica formato WebP automáticamente",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FiCheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mock-up */}
            <div className="relative hidden overflow-hidden bg-background/50 md:flex md:flex-col md:items-center md:justify-center md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,58,36,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,58,36,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="relative w-full max-w-xs rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-muted-foreground">photo.jpg</span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-500">
                      WebP ✓
                    </span>
                  </div>
                  {(
                    [
                      { label: "Leyendo…", done: true },
                      { label: "→ WebP", done: true },
                      { label: "Optimizando…", done: true },
                    ] as { label: string; done: boolean }[]
                  ).map(({ label, done }) => (
                    <div key={label} className="grid gap-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-mono">{label}</span>
                        {done && <FiCheckCircle className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full w-full rounded-full bg-primary" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs">
                    <span className="text-muted-foreground line-through">2.4 MB</span>
                    <span className="font-mono text-muted-foreground">→</span>
                    <span className="font-semibold text-emerald-500">480 KB</span>
                    <span className="text-emerald-500/70">-80 %</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEO checklist preview ── */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="grid gap-5">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <FiCheckCircle className="h-3.5 w-3.5" /> Auditoría automática
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              14 criterios SEO
              <br />
              validados al instante
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tras cada generación, el sistema ejecuta 14 comprobaciones SEO con animación en cascada y puntuación de
              0 a 100. Si falla alguna, el botón{" "}
              <span className="font-medium text-foreground">«Perfeccionar SEO con IA»</span> reenvía los criterios
              fallidos a Claude para corregirlos automáticamente.
            </p>
            <Link href={ROUTES.login}>
              <Button className="inline-flex w-fit items-center gap-2">
                Ver en acción <FiArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                SEO Checklist
              </span>
              <span className="font-heading text-xl font-bold text-yellow-500">91/100</span>
            </div>
            <ul className="grid gap-1.5">
              {seoChecks.map(({ label, pass }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-xs"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white ${
                      pass ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {pass ? (
                      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    ) : (
                      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
                      </svg>
                    )}
                  </span>
                  <span className={pass ? "text-foreground" : "text-red-400"}>{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[91%] rounded-full bg-yellow-500 transition-all" />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Convertir imagen a WebP → 100/100
            </p>
          </div>
        </section>

        {/* ── Claude streaming terminal ── */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-8 md:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div className="grid gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                <FiZap className="h-3.5 w-3.5" /> IA Generativa
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Streaming en vivo con
                <br />
                <span className="text-primary">Claude AI</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cada artículo se construye en tiempo real usando la API de streaming de Anthropic. El JSON aparece
                carácter a carácter con syntax highlighting en el panel de preview, dando una experiencia visual
                única al equipo editorial.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                El sistema prompt optimizado garantiza salidas que cumplen los 14 criterios SEO en el 95 %+ de los
                casos. Si no, el bucle de mejora con IA los corrige automáticamente.
              </p>
            </div>

            {/* Fake terminal */}
            <div className="overflow-hidden rounded-xl border border-border bg-background font-mono text-xs shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-muted-foreground/60">claude-stream · live</span>
              </div>
              <div className="space-y-0.5 p-4 text-[11px] leading-relaxed">
                <p className="text-muted-foreground">{"{"}</p>
                <p className="pl-4">
                  <span className="text-blue-400">&quot;seo&quot;</span>
                  <span className="text-muted-foreground">{": {"}</span>
                </p>
                <p className="pl-8">
                  <span className="text-blue-400">&quot;title&quot;</span>
                  <span className="text-muted-foreground">{": "}</span>
                  <span className="text-orange-400">&quot;Mejor ASIC para minar Bitcoin en 2026&quot;</span>
                </p>
                <p className="pl-8">
                  <span className="text-blue-400">&quot;slug&quot;</span>
                  <span className="text-muted-foreground">{": "}</span>
                  <span className="text-orange-400">&quot;mejor-asic-bitcoin-2026&quot;</span>
                </p>
                <p className="pl-8">
                  <span className="text-blue-400">&quot;keywords&quot;</span>
                  <span className="text-muted-foreground">{": ["}</span>
                  <span className="text-orange-400">&quot;minería bitcoin&quot;</span>
                  <span className="text-muted-foreground">{", …]"}</span>
                </p>
                <p className="pl-4 text-muted-foreground">{"}"}</p>
                <p className="pl-4">
                  <span className="text-blue-400">&quot;article&quot;</span>
                  <span className="text-muted-foreground">{": {"}</span>
                </p>
                <p className="pl-8">
                  <span className="text-blue-400">&quot;h1&quot;</span>
                  <span className="text-muted-foreground">{": "}</span>
                  <span className="text-orange-400">&quot;Los mejores ASIC para minar Bitcoi</span>
                  <span className="animate-pulse text-primary">▊</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <Card className="relative overflow-hidden rounded-2xl text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative grid gap-5 p-4 md:p-8">
            <span className="inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Listo para explorar
            </span>
            <h2 className="font-heading text-4xl font-bold text-foreground">
              Prueba el flujo completo
              <br />
              <span className="text-primary">en menos de 30 segundos</span>
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground">
              Accede al panel de generación, crea un artículo SEO completo con Claude AI y comprueba cómo las
              imágenes se convierten a WebP automáticamente con el checklist SEO validándolo todo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={ROUTES.login}>
                <Button className="inline-flex items-center gap-2 px-8 py-3 text-base">
                  <MdAutoAwesome className="h-4 w-4" aria-hidden />
                  Empezar ahora
                  <FiArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
