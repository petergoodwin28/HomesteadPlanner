"use client";

import React from "react";

/* -------------------------------------------------------
   CropVisual
   Default = Initials (Option C)
   Commented section = Icons + Colors (Option B)
-------------------------------------------------------- */

interface CropVisualProps {
  name: string;
  color?: string; // optional (future use for icons/colors)
  size?: "sm" | "md" | "lg";
}

export function CropVisual({ name, color = "#4B5563", size = "md" }: CropVisualProps) {
  /* -----------------------------
     INITIALS VERSION (Option C)
     Primary implementation
  ------------------------------ */

  const initials = getInitials(name);

  const sizeClass =
    size === "sm"
      ? "text-[10px] w-4 h-4"
      : size === "lg"
      ? "text-sm w-7 h-7"
      : "text-xs w-5 h-5";

  return (
    <div
      className={`flex items-center justify-center font-semibold rounded-sm text-white ${sizeClass}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );

  /* --------------------------------------------------------
     ICON VERSION (Option B)
     (Commented out: Ready to toggle in when you want)
     - To use, comment out the INITIALS return above
     - And uncomment this block.
  ---------------------------------------------------------

  const icon = cropIcons[name.toLowerCase()] ?? "🌱";

  return (
    <div
      className={`flex items-center justify-center rounded-sm ${sizeClass}`}
      style={{ backgroundColor: color }}
    >
      <span className="text-lg">{icon}</span>
    </div>
  );

  --------------------------------------------------------- */
}

/* Utility: Generate initials */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* --------------------------------------------------------
   OPTIONAL ICON DICTIONARY (Option B)
   (Not used right now – fully wired for future)
---------------------------------------------------------

const cropIcons: Record<string, string> = {
  tomato: "🍅",
  lettuce: "🥬",
  kale: "🥬",
  "green beans": "🫘",
  beans: "🫘",
  carrot: "🥕",
  carrots: "🥕",
  herbs: "🌿",
  potato: "🥔",
  potatoes: "🥔",
  radish: "❤️",
  ginger: "🫚",
  garlic: "🧄",
};

--------------------------------------------------------- */

export default CropVisual;
