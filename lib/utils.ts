import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Severity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SEVERITY_LABELS: Record<Severity, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function severityLabel(severity: Severity) {
  return SEVERITY_LABELS[severity] ?? "Unknown";
}

export function severityBadgeClass(severity: Severity) {
  switch (severity) {
    case "none":
      return "border-white/10 bg-white/5 text-white/70";
    case "low":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
    case "medium":
      return "border-amber-400/30 bg-amber-400/10 text-amber-200";
    case "high":
      return "border-orange-400/30 bg-orange-400/10 text-orange-200";
    case "critical":
      return "border-red-400/30 bg-red-400/10 text-red-200";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export function severityDotColor(severity: Severity) {
  switch (severity) {
    case "none":
      return "#4ecb5c";
    case "low":
      return "#34d399";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#f97316";
    case "critical":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
}

export function generateScanId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 1000)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `SCAN-${time}-${rand}`;
}
