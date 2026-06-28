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
    <div className="mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="text-orange-600" size={28} />
        <h2 className="text-2xl md:text-3xl font-black text-[#0b1b36] m-0">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border border-orange-100 rounded-2xl bg-white overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
              >
                <span className="font-bold text-orange-600 pr-4">{item.question}</span>
                <ChevronDown 
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} 
                  size={20} 
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-slate-600">
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
