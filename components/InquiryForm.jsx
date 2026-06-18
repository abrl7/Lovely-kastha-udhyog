"use client";

export default function InquiryForm() {
  function handleSubmit(e) {
    e.preventDefault();
    alert(
      "Thanks! This form is a placeholder — connect it to email or a backend to receive real inquiries."
    );
  }

  const fieldClass =
    "w-full px-[0.9rem] py-[0.8rem] border-[1.5px] border-walnut/20 bg-cream-soft rounded-sm font-sans text-[0.92rem] text-charcoal focus:outline-2 focus:outline-sienna focus:outline-offset-1 focus:border-sienna";

  const labelClass =
    "block text-[0.78rem] font-semibold tracking-[0.04em] text-walnut-deep mb-[0.4rem]";

  return (
    <div className="py-[6.5rem] px-[5vw]">
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-[1.1rem] mb-[1.1rem]">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input type="text" id="name" required className={fieldClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>
            <input type="tel" id="phone" required className={fieldClass} />
          </div>
        </div>
        <div className="mb-[1.1rem]">
          <label htmlFor="interest" className={labelClass}>
            What are you interested in?
          </label>
          <select id="interest" className={fieldClass}>
            <option>Living Room Furniture</option>
            <option>Bedroom Furniture</option>
            <option>Dining Furniture</option>
            <option>Office Furniture</option>
            <option>Custom Order</option>
          </select>
        </div>
        <div className="mb-[1.1rem]">
          <label htmlFor="message" className={labelClass}>
            Tell us more
          </label>
          <textarea
            id="message"
            placeholder="Describe the piece you're looking for, dimensions, wood preference, etc."
            className={`${fieldClass} min-h-[100px] resize-y`}
          />
        </div>
        <button
          type="submit"
          className="bg-sienna text-cream-soft border-none px-[2.3rem] py-[0.95rem] font-semibold text-[0.88rem] tracking-[0.04em] rounded-sm cursor-pointer hover:bg-sienna-dark transition-colors duration-200"
        >
          Send Inquiry
        </button>
        <p className="text-[0.78rem] text-[#8a7c68] mt-[0.8rem]">
          This form is a placeholder for now — wire it up to email or a
          backend before launch.
        </p>
      </form>
    </div>
  );
}
