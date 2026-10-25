import { crossRates } from "@/content/home";

/**
 * Live cross-rate board. Same iframe the homepage of shilan.co.il embeds
 * immediately above "לקוחות ממליצים".
 */
export function CrossRates() {
  return (
    <section aria-labelledby="cross-rates-heading" className="bg-white py-10 lg:py-12">
      <div className="container-content">
        <h2 id="cross-rates-heading" className="sr-only">
          {crossRates.title}
        </h2>
        <iframe
          src={crossRates.src}
          title={crossRates.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[400px] w-full max-w-full border-0"
        />
      </div>
    </section>
  );
}
