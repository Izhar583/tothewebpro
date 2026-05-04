"use client";

import { useMemo, useState } from "react";
import {
  toAlternatingCase,
  toCamelCase,
  toKebabCase,
  toLowerCase,
  toSentenceCase,
  toSnakeCase,
  toTitleCase,
  toUpperCase,
} from "@/lib/textUtils";

export interface CaseOutputs {
  upper: string;
  lower: string;
  title: string;
  sentence: string;
  alternating: string;
  camel: string;
  snake: string;
  kebab: string;
}

export function useCaseConverter(initial = "") {
  const [input, setInput] = useState(initial);

  const outputs = useMemo<CaseOutputs>(() => {
    return {
      upper: toUpperCase(input),
      lower: toLowerCase(input),
      title: toTitleCase(input),
      sentence: toSentenceCase(input),
      alternating: toAlternatingCase(input),
      camel: toCamelCase(input),
      snake: toSnakeCase(input),
      kebab: toKebabCase(input),
    };
  }, [input]);

  return { input, setInput, outputs };
}
