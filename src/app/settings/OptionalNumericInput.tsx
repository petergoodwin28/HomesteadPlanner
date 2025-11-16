"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface OptionalNumericInputProps {
  value: number | undefined;
  onCommit: (v: number | undefined) => void;
  min?: number;
  step?: number;
  placeholder?: string;
  className?: string;
}

export function OptionalNumericInput({
  value,
  onCommit,
  min = 0,
  step = 1,
  placeholder,
  className,
}: OptionalNumericInputProps) {
  const [raw, setRaw] = useState(value?.toString() ?? "");

  useEffect(() => {
    const newRaw = value?.toString() ?? "";
    if (raw !== newRaw) setRaw(newRaw);
  }, [value]);

  return (
    <Input
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
      }}
      onBlur={() => {
        if (raw.trim() === "") {
          onCommit(undefined);
          return;
        }

        const parsed = parseFloat(raw);

        if (!Number.isFinite(parsed)) {
          setRaw(value?.toString() ?? "");
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
