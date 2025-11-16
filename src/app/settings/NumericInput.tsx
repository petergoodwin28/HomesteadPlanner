"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface NumericInputProps {
  value: number;                     // value from Zustand
  onCommit: (v: number) => void;     // called after sanitizing on blur
  min?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export function NumericInput({
  value,
  onCommit,
  min = 0,
  step = 1,
  placeholder,
  className,
}: NumericInputProps) {
  const [raw, setRaw] = useState(value.toString());

  // Sync external value → local when store changes
  useEffect(() => {
    if (raw !== value.toString()) {
      setRaw(value.toString());
    }
  }, [value]);

  return (
    <Input
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
      }}
      onBlur={() => {
        const parsed = parseFloat(raw);

        if (!Number.isFinite(parsed)) {
          // Reset to previous value
          setRaw(value.toString());
          return;
        }

        const cleaned = Math.max(min, parsed);
        setRaw(cleaned.toString());
        onCommit(cleaned);
      }}
      step={step}
      placeholder={placeholder}
      className={className}
    />
  );
}
