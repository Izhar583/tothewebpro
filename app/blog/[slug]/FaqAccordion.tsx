"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-10 sm:mt-14 mb-8 w-full">
      <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <HelpCircle className="text-orange-600 shrink-0" size={24} />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0b1b36] m-0 break-words">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-orange-100 rounded-xl sm:rounded-2xl bg-white overflow-hidden shadow-sm transition-colors"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 focus:outline-none transition-colors hover:bg-orange-50/40"
              >
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug pr-2 break-words">
                  {item.question}
                </span>
                <ChevronDown
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-orange-600" : ""
                  }`}
                  size={18}
                />
              </button>
              {isOpen && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-slate-600 text-sm sm:text-base border-t border-orange-50/80">
                  <p className="leading-relaxed break-words">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
