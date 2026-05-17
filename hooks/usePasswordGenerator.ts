"use client";

import { useCallback, useState } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = LOWER.toUpperCase();
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}";

/**
 * Bias-free random character selection using rejection sampling.
 * Standard modulo (`bytes[i] % pool.length`) produces a non-uniform
 * distribution when pool.length is not a power of 2. We reject any
 * byte whose value falls in the "remainder" tail and resample.
 */
function unbiasedPick(pool: string, randomBytes: () => number): string {
  const len = pool.length;
  // Largest multiple of len that fits in a byte (0-255)
  const maxValid = 256 - (256 % len);
  let byte: number;
  do {
    byte = randomBytes();
  } while (byte >= maxValid);
  return pool[byte % len]!;
}

export function usePasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    let pool = "";
    if (useLower) pool += LOWER;
    if (useUpper) pool += UPPER;
    if (useDigits) pool += DIGITS;
    if (useSymbols) pool += SYMBOLS;

    if (!pool) {
      setError("Select at least one character type.");
      setPassword("");
      return;
    }
    setError(null);

    // Fill a buffer large enough to handle rejection sampling overhead
    // (worst case ~2× the requested length for very small pool sizes).
    const buffer = new Uint8Array(length * 4);
    crypto.getRandomValues(buffer);
    let bufIdx = 0;

    const randomByte = (): number => {
      if (bufIdx >= buffer.length) {
        // Refill if we somehow exhaust it
        crypto.getRandomValues(buffer);
        bufIdx = 0;
      }
      return buffer[bufIdx++]!;
    };

    let out = "";
    for (let i = 0; i < length; i++) {
      out += unbiasedPick(pool, randomByte);
    }
    setPassword(out);
  }, [length, useDigits, useLower, useSymbols, useUpper]);

  return {
    length,
    setLength,
    useUpper,
    setUseUpper,
    useLower,
    setUseLower,
    useDigits,
    setUseDigits,
    useSymbols,
    setUseSymbols,
    password,
    error,
    generate,
  };
}
