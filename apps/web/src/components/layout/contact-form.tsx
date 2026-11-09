"use client";

import { Button } from "@shilan/ui/components/button";
import { Checkbox, Chip, ChipGroup, Input, Label, Textarea } from "@shilan/ui/components/form-controls";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { contactForm } from "@/content/home";

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [audience, setAudience] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setSent(false);
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          message: String(form.get("message") ?? ""),
          audience,
          consent,
          pageUrl: window.location.href,
          company: String(form.get("company") ?? ""),
        }),
      });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !body?.ok) {
        setError(body?.message || contactForm.error);
        return;
      }
      setSent(true);
      formRef.current?.reset();
      setAudience("");
      setConsent(false);
    } catch {
      setError(contactForm.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-card border border-white/80 bg-white/10 px-5 py-7 text-white sm:px-[45px] lg:px-[42px] lg:pt-8 lg:pb-10">
      <h2 className="text-h3 font-bold">{contactForm.title}</h2>
      <p className="mt-2 text-body font-bold whitespace-pre-line">{contactForm.subtitle}</p>

      <form
        ref={formRef}
        className="mt-6 flex flex-col gap-2 lg:mt-8 lg:flex-1 lg:justify-between"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-name`} className="sr-only">
            {contactForm.name}
          </Label>
          <Input id={`${id}-name`} name="name" autoComplete="name" placeholder={contactForm.name} required />

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
            required
          />

          <Label htmlFor={`${id}-message`} className="sr-only">
            {contactForm.message}
          </Label>
          <Textarea id={`${id}-message`} name="message" placeholder={contactForm.message} required />
        </div>

        <p id={`${id}-audience`} className="mt-1 text-field lg:mt-0">
          {contactForm.audienceLabel}
        </p>
        <ChipGroup
          name="audience"
          aria-labelledby={`${id}-audience`}
          value={audience}
          onValueChange={setAudience}
        >
          {contactForm.audiences.map((a) => (
            <Chip key={a.value} value={a.value}>
              {a.label}
            </Chip>
          ))}
        </ChipGroup>

        <div className="mt-2 flex items-center gap-2">
          <Checkbox
            id={`${id}-consent`}
            checked={consent}
            onCheckedChange={(value) => setConsent(value === true)}
          />
          <Label htmlFor={`${id}-consent`} className="text-fine">
            {contactForm.consentPrefix}
            <Link href="/privacy" className="underline">
              {contactForm.consentLink}
            </Link>
          </Label>
        </div>

        <p className="sr-only" aria-hidden="true">
          <label>
            השאר ריק
            <input name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </p>

        {error && (
          <p role="alert" className="rounded-control bg-white px-3 py-2 text-caption font-bold text-red-700">
            {error}
          </p>
        )}
        {sent && (
          <p role="status" className="rounded-control bg-white px-3 py-2 text-caption font-bold text-green-900">
            {contactForm.success}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2 w-full min-w-0 text-field lg:min-h-[34px]">
          {pending ? contactForm.sending : contactForm.submit}
        </Button>
      </form>
    </div>
  );
}
