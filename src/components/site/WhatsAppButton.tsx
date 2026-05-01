import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Configure your WhatsApp number here
const WHATSAPP_NUMBER = "+27823456789"; // Replace with your actual number
const DEFAULT_MESSAGE = "Hi! I'm interested in learning more about your products.";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const message = encodeURIComponent(DEFAULT_MESSAGE);
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BD5A] transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">WhatsApp</span>
      </button>

      {/* Optional: Tooltip */}
      <div className="fixed bottom-24 right-6 z-50">
        <div className="bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg">
          <p>Chat with us on WhatsApp</p>
        </div>
      </div>
    </>
  );
}

export default WhatsAppButton;
