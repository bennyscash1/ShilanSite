import { Carousel } from "@shilan/ui/components/carousel";
import { SectionHeading } from "@shilan/ui/components/section-heading";
import { StarRating } from "@shilan/ui/components/star-rating";
import { testimonials, testimonialsSection } from "@/content/home";
import { uiStrings } from "@/content/ui-strings";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-screen bg-cream-50">
      <div className="container-content w-full">
        <SectionHeading className="text-center">{testimonialsSection.title}</SectionHeading>
      </div>
      <div className="container-content mt-8 w-full md:mt-12">
        <Carousel
          label={uiStrings.carouselLabel}
          prevLabel={uiStrings.carouselPrev}
          nextLabel={uiStrings.carouselNext}
          trackClassName="gap-4 md:gap-6"
        >
          {testimonials.map((t) => (
            <li
              key={t.id}
              className="w-[80%] shrink-0 sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <figure className="flex h-full min-h-40 flex-col rounded-control border border-gold-600 bg-white px-5 pt-6 pb-5 md:min-h-48 md:px-6">
                <StarRating
                  value={t.rating}
                  label={uiStrings.rating(t.rating, 5)}
                  className="text-caption"
                />
                <blockquote className="mt-2 text-caption whitespace-pre-line text-ink md:text-body">
                  {t.text}
                </blockquote>
                <figcaption className="mt-3 text-caption font-bold md:text-body">
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
