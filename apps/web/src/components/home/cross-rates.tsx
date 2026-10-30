import { crossRates } from "@/content/home";

/**
 * Live cross-rate board. Same iframe the homepage of shilan.co.il embeds
 * immediately above "לקוחות ממליצים".
 */
export function CrossRates() {
  return (
    <section aria-labelledby="cross-rates-heading" className="section-screen bg-white">
      <div className="container-content w-full">
        <h2 id="cross-rates-heading" className="sr-only">
          {crossRates.title}
        </h2>
        <iframe
          src={crossRates.src}
          title={crossRates.title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[400px] w-full max-w-full border-0 md:h-[min(70svh,760px)]"
        />
      </div>
    </section>
  );
}
