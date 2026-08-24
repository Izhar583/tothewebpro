"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  dotColor?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "left" | "right";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select option",
  icon,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "left",
  disabled = false,
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-3.5 py-2 text-xs sm:text-sm rounded-xl",
    lg: "px-4 py-2.5 text-sm rounded-2xl",
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 bg-white border border-slate-200 shadow-sm hover:border-orange-300 hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-slate-800 ${
          isOpen ? "border-orange-500 ring-2 ring-orange-500/20 bg-slate-50/80" : ""
        } ${sizeClasses[size]} ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          {selectedOption?.dotColor && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${selectedOption.dotColor}`}
            />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-500" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 min-w-[200px] w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 z-50 ${menuClassName}`}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  isSelected
                    ? "bg-orange-50 text-orange-600 font-bold border border-orange-200/60"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {option.icon && (
                    <span className="text-slate-400 shrink-0">
                      {option.icon}
                    </span>
                  )}
                  {option.dotColor && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${option.dotColor}`}
                    />
                  )}
                  <span className="truncate">{option.label}</span>
                  {option.badge && (
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {option.badge}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check
                    size={14}
                    className="text-orange-600 shrink-0 font-bold"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
