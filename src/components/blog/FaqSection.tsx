"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { Card } from "@/components/ui/Card";
import { UI_TEXT } from "@/lib/constants";
import type { FaqItem } from "@/lib/types";

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="grid gap-4">
      <h2 className="font-heading text-2xl font-semibold text-foreground">{UI_TEXT.faqTitle}</h2>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <Card key={item.question} className="p-0">
            <button
              className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-all duration-150 ease-in-out hover:bg-secondary"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              type="button"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground">{item.question}</h3>
              <FiChevronDown
                aria-hidden="true"
                className={`h-5 w-5 text-muted-foreground transition-all duration-150 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {isOpen ? <p className="px-6 pb-5 text-base text-foreground">{item.answer}</p> : null}
          </Card>
        );
      })}
    </section>
  );
}
