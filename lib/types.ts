export type Severity = "none" | "low" | "medium" | "high" | "critical";

export type DetectionResult = {
  label: string;
  displayName: string;
  crop: string;
  confidence: number;
  severity: Severity;
  vitality: number;
  treatments: string[];
  prevention: string;
  isHealthy: boolean;
};
