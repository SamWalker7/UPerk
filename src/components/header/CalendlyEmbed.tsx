import React, { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const CalendlyEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    trackEvent("calendly_embed_view", {
      category: "lead_generation",
      calendly_url: url,
    });

    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    if (head) {
      head.appendChild(script);
    }
  }, [url]);

  return (
    <div
      className="calendly-inline-widget  dark:bg-transparent -mt-5 dark:mt-0"
      data-url={url}
      style={{
        height: "650px",
        width: "100%",
      }}
    ></div>
  );
};

export default CalendlyEmbed;
