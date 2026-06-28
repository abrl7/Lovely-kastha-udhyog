"use client";

const WHATSAPP_NUMBER = "9779816630510";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'd like to inquire about your furniture."
);

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.77L0 32l8.43-2.01A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.795-1.867l-.487-.29-5.006 1.194 1.22-4.868-.317-.5A13.256 13.256 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667c7.364 0 13.333 5.969 13.333 13.333 0 7.364-5.969 13.333-13.333 13.333zm7.307-9.987c-.4-.2-2.365-1.167-2.731-1.3-.366-.133-.632-.2-.898.2-.266.4-1.033 1.3-1.266 1.566-.233.267-.466.3-.866.1-.4-.2-1.688-.623-3.216-1.984-1.188-1.06-1.99-2.369-2.224-2.769-.233-.4-.025-.616.175-.816.18-.18.4-.466.6-.7.2-.233.266-.4.4-.666.133-.267.066-.5-.033-.7-.1-.2-.898-2.166-1.231-2.966-.325-.778-.655-.672-.898-.684l-.765-.013c-.267 0-.7.1-1.066.5-.366.4-1.4 1.367-1.4 3.333s1.433 3.867 1.633 4.133c.2.267 2.82 4.308 6.832 6.04.955.413 1.7.66 2.281.845.958.305 1.83.262 2.52.159.769-.115 2.365-.967 2.698-1.9.333-.934.333-1.734.233-1.9-.1-.167-.366-.267-.766-.467z" />
      </svg>
    </a>
  );
}
