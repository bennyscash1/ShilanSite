"use client";

import { Button } from "@shilan/ui/components/button";
import { Checkbox, Chip, ChipGroup, Input, Label, Textarea } from "@shilan/ui/components/form-controls";
import Link from "next/link";
import { useId } from "react";
import { contactForm } from "@/content/home";

// UI only. Validation, the Server Action and Firestore are wired in step 4.
export function ContactForm() {
  const id = useId();

  return (
    <div className="rounded-card border border-white/80 bg-white/10 px-5 py-7 text-white sm:px-[45px] lg:pt-6 lg:pb-10">
      <h2 className="text-h3 font-bold">{contactForm.title}</h2>
      <p className="mt-2 text-body font-bold whitespace-pre-line">{contactForm.subtitle}</p>

      <form className="mt-6 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <Label htmlFor={`${id}-name`} className="sr-only">
          {contactForm.name}
        </Label>
        <Input id={`${id}-name`} name="name" autoComplete="name" placeholder={contactForm.name} />

        <Label htmlFor={`${id}-phone`} className="sr-only">
          {contactForm.phone}
        </Label>
        <Input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="rtl"
          placeholder={contactForm.phone}
        />

        <Label htmlFor={`${id}-message`} className="sr-only">
          {contactForm.message}
        </Label>
        <Textarea id={`${id}-message`} name="message" placeholder={contactForm.message} />

        <p id={`${id}-audience`} className="mt-1 text-field">
          {contactForm.audienceLabel}
        </p>
        <ChipGroup name="audience" aria-labelledby={`${id}-audience`}>
          {contactForm.audiences.map((a) => (
            <Chip key={a.value} value={a.value}>
              {a.label}
            </Chip>
          ))}
        </ChipGroup>

        <div className="mt-2 flex items-center gap-2">
          <Checkbox id={`${id}-consent`} name="consent" />
          <Label htmlFor={`${id}-consent`} className="text-fine">
            {contactForm.consentPrefix}
            <Link href="/privacy" className="underline">
              {contactForm.consentLink}
            </Link>
          </Label>
        </div>

        <Button type="submit" className="mt-2 w-full min-w-0 text-field lg:min-h-[34px]">
          {contactForm.submit}
        </Button>
      </form>
    </div>
  );
}
