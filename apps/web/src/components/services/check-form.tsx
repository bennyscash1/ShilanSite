"use client";

import { Button } from "@shilan/ui/components/button";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const fieldClass =
  "w-full rounded-control border border-gold-500 bg-white/80 px-3 py-2 text-body text-green-900 outline-none focus-visible:outline-2 focus-visible:outline-gold-500";

export function CheckInquiryForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setSent(false);
    const form = event.currentTarget;
    setPending(true);
    try {
      const response = await fetch("/api/checks", { method: "POST", body: new FormData(form) });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !body?.ok) {
        setError(body?.message || "לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד רגע.");
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError("לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד רגע.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-xl rounded-card border border-gold-500 bg-white px-5 py-8 text-green-900 md:px-8" noValidate>
      <h2 className="text-center text-title font-bold">להעברת שיקים לבדיקה</h2>
      <p className="mt-2 text-center text-body">נא למלא את הפרטים בטופס ולצרף את צילומי השיקים</p>
      <div className="mt-6 flex flex-col gap-3">
        <label className="text-caption" htmlFor="check-name">שם</label>
        <input id="check-name" name="name" autoComplete="name" required className={fieldClass} />
        <label className="text-caption" htmlFor="check-phone">טלפון</label>
        <input id="check-phone" name="phone" type="tel" autoComplete="tel" required className={fieldClass} />
        <label className="text-caption" htmlFor="check-email">מייל</label>
        <input id="check-email" name="email" type="email" autoComplete="email" dir="ltr" className={fieldClass} />
        <label className="text-caption" htmlFor="check-notes">הערות</label>
        <textarea id="check-notes" name="notes" className={`${fieldClass} min-h-14`} />
        <p className="text-caption">צילום שיקים - נא לצלם את חזית השיק באופן ברור. ניתן לצרף עד 10 שיקים</p>
        <label className="inline-flex w-fit cursor-pointer rounded-control border border-gold-500 bg-white px-3 py-1 text-caption">
          הוספת תמונה
          <input name="photos" type="file" accept="image/*" multiple className="sr-only" />
        </label>
        <label className="flex items-start gap-2 text-caption">
          <input name="consent" type="checkbox" required className="mt-1 size-3 accent-green-900" />
          <span>
            בשליחה אני מאשר/ת את{" "}
            <Link href="/privacy" className="underline">
              מדיניות הפרטיות
            </Link>
          </span>
        </label>
        {error ? (
          <p role="alert" className="text-caption font-bold text-red-700">{error}</p>
        ) : null}
        {sent ? (
          <p role="status" className="text-caption font-bold">הבקשה נשלחה. נחזור אליכם אחרי הבדיקה.</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "שולח..." : "שליחת השיק לבדיקה"}
        </Button>
      </div>
    </form>
  );
}
