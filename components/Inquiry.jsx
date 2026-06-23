import InquiryForm from "./InquiryForm";

export default function Inquiry() {
  return (
    <section
      id="inquiry"
      className="bg-cream grid md:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="bg-walnut text-cream-soft py-[6.5rem] px-[5vw]">
        <span className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass">
          Get In Touch
        </span>
        <h2 className="font-serif font-normal text-[2.2rem] mt-[0.7rem] mb-[1.3rem]">
          Tell us what you&apos;re building.
        </h2>
        <p className="text-cream-soft/80 mb-8 max-w-[380px]">
          Looking for a piece from our collection, or something custom-made
          to fit your space? Send us a few details and we&apos;ll get back
          to you within a day.
        </p>
        <div className="mb-[1.1rem]">
          <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
            Workshop
          </span>
          <span className="text-[0.98rem]">
            [Your dad&apos;s workshop address here]
          </span>
        </div>
        <div className="mb-[1.1rem]">
          <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
            Phone
          </span>
          <span className="text-[0.98rem]">[Phone number here]</span>
        </div>
        <div className="mb-[1.1rem]">
          <span className="block text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-brass mb-[0.2rem]">
            Hours
          </span>
          <span className="text-[0.98rem]">Sun–Fri, 10am – 7pm</span>
        </div>
      </div>
      <InquiryForm />
    </section>
  );
}
