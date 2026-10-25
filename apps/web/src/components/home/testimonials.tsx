import { Carousel } from "@shilan/ui/components/carousel";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import { StarRating } from "@shilan/ui/components/star-rating";
import { testimonials, testimonialsSection } from "@/content/home";
import { uiStrings } from "@/content/ui-strings";

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-cream-50 py-12 lg:py-16">
      <div className="container-content">
        <SectionHeading className="text-center">{testimonialsSection.title}</SectionHeading>
      </div>
      <div className="mx-auto mt-6 max-w-[1207px] px-(--spacing-gutter) lg:mt-8 xl:px-0">
        <Carousel
          label={uiStrings.carouselLabel}
          prevLabel={uiStrings.carouselPrev}
          nextLabel={uiStrings.carouselNext}
          trackClassName="gap-[11px]"
        >
          {testimonials.map((t) => (
            <li
              key={t.id}
              className="w-[80%] shrink-0 sm:w-[calc((100%-11px)/2)] md:w-[calc((100%-22px)/3)] lg:w-[232px]"
            >
              <figure className="flex h-full min-h-[115px] flex-col rounded-control border border-gold-600 bg-white ps-[14px] pe-6 pt-5 pb-3">
                <StarRating
                  value={t.rating}
                  label={uiStrings.rating(t.rating, 5)}
                  className="text-[11px]"
                />
                <blockquote className="mt-[3px] text-caption whitespace-pre-line text-ink lg:text-micro">
                  {t.text}
                </blockquote>
                <figcaption className="mt-1 text-caption font-bold lg:text-micro">
                  {t.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
