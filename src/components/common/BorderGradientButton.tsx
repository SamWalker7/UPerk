import React from "react";
interface ButtonProps {
  text: string;
  onHandleBookAcall?: () => void;
  showCalendly?: boolean
  analyticsEvent?: string;
  analyticsCategory?: string;
  analyticsLabel?: string;
}

const BorderGradientButton = ({
  text,
  onHandleBookAcall,
  showCalendly,
  analyticsEvent,
  analyticsCategory,
  analyticsLabel,
}: ButtonProps) => {
  return (
    <button
      className=" w-[206px] relative inline-block px-6 py-2 cursor-pointer rounded-[35px] dark:bg-black bg-white dark:text-[#EAEAEA] text-[#272828] font-semibold z-10 overflow-hidden group"
      onClick={() => onHandleBookAcall?.()}
      data-analytics-event={analyticsEvent}
      data-analytics-category={analyticsCategory}
      data-analytics-label={analyticsLabel}
    >
      <span className="absolute inset-0 rounded-[35px] p-[2px] bg-gradient-to-r from-[#2563eb] via-[#2ca2f4] to-[#34e5ff] z-[-1] group-hover:opacity-100 transition-opacity duration-300">
        <span className="block h-full w-full rounded-[35px] dark:bg-black bg-white"></span>
      </span>
      { showCalendly ? "Close" : text}
    </button>
  );
};

export default BorderGradientButton;
