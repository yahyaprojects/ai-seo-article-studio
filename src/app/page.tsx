import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES, UI_TEXT } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="grid gap-6">
      <Card className="grid gap-6 rounded-xl">
        <p className="text-sm text-muted-foreground">{UI_TEXT.heroEyebrow}</p>
        <h1 className="font-heading text-4xl font-bold text-hero-text md:text-5xl">{UI_TEXT.heroTitle}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-foreground">{UI_TEXT.heroDescription}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={ROUTES.admin}>
            <Button>{UI_TEXT.heroPrimaryCta}</Button>
          </Link>
          <Link href={ROUTES.preview}>
            <Button variant="ghost">{UI_TEXT.heroSecondaryCta}</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
