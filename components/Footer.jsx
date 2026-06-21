export default function Footer() {
  return (
    <footer className="bg-walnut-deep text-cream/70 pt-14 px-[6vw] pb-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
        <div>
          <div className="font-serif text-[1.3rem] text-cream mb-[0.6rem]">
            Lovely Kastha Udhog
          </div>
          <p className="text-[0.88rem] max-w-[280px]">
            Handcrafted solid wood furniture, made by a family that&apos;s
            been doing this for three generations.
          </p>
        </div>
        <div>
          <h5 className="text-[0.75rem] tracking-[0.1em] uppercase text-brass mb-[0.9rem]">
            Explore
          </h5>
          <a href="#categories" className="block text-[0.88rem] mb-[0.55rem]">
            Collections
          </a>
          <a href="#featured" className="block text-[0.88rem] mb-[0.55rem]">
            Featured
          </a>
          <a href="#story" className="block text-[0.88rem] mb-[0.55rem]">
            Our Story
          </a>
        </div>
        <div>
          <h5 className="text-[0.75rem] tracking-[0.1em] uppercase text-brass mb-[0.9rem]">
            Contact
          </h5>
          <p className="text-[0.88rem] mb-[0.55rem]">[Phone]</p>
          <p className="text-[0.88rem] mb-[0.55rem]">[Email]</p>
          <p className="text-[0.88rem] mb-[0.55rem]">[Address]</p>
        </div>
        <div>
          <h5 className="text-[0.75rem] tracking-[0.1em] uppercase text-brass mb-[0.9rem]">
            Follow
          </h5>
          <a href="#" className="block text-[0.88rem] mb-[0.55rem]">
            Facebook
          </a>
          <a href="#" className="block text-[0.88rem] mb-[0.55rem]">
            Instagram
          </a>
          <a href="#" className="block text-[0.88rem] mb-[0.55rem]">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-cream/10 pt-6 text-[0.78rem] flex flex-col sm:flex-row justify-between gap-2">
        <span>© 2026 Lovely Kastha Udhog. All rights reserved.</span>
        <span>Built with care.</span>
      </div>
    </footer>
  );
}
