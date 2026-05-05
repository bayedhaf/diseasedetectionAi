"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Camera,
  ZoomIn,
  Grid3x3,
  Info,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Microscope,
  Leaf,
  FlaskConical,
  ShieldCheck,
  Plus,
  X,
  RotateCcw,
  Droplets,
  Thermometer,
  Wind,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────
type Stage = "idle" | "scanning" | "done" | "error";

interface TreatmentResult {
  disease: string;
  confidence: number;
  severity: string;
  recommendation: string;
  treatment: {
    chemical: string;
    organic: string;
    prevention: string;
  };
}

type ApiDetectResult = {
  label?: string;
  displayName?: string;
  crop?: string;
  confidence?: number;
  severity?: "none" | "low" | "medium" | "high" | "critical";
  vitality?: number;
  treatments?: string[];
  prevention?: string;
  isHealthy?: boolean;
};

type RecentDiagnosis = {
  id: number;
  crop: string;
  disease: string;
  date: string;
  confidence: number;
  status: "healthy" | "low" | "medium" | "high" | "critical";
};

function mapSeverity(severity?: ApiDetectResult["severity"]) {
  switch (severity) {
    case "critical":
    case "high":
      return "High";
    case "medium":
      return "Moderate";
    case "low":
      return "Low";
    case "none":
      return "Healthy";
    default:
      return "Low";
  }
}

function toTreatmentResult(payload: any): TreatmentResult {
  const apiResult: ApiDetectResult | undefined = payload?.result ?? payload;
  const treatments = apiResult?.treatments ?? [];
  const isHealthy = apiResult?.isHealthy || apiResult?.severity === "none";
  const confidenceRaw = apiResult?.confidence ?? 0;
  const confidence = Math.round(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw);
  const diseaseName = apiResult?.displayName || apiResult?.label || "Unknown";

  return {
    disease: isHealthy ? "No disease detected" : diseaseName,
    confidence,
    severity: mapSeverity(apiResult?.severity),
    recommendation: treatments[0] || "Follow recommended treatment plan",
    treatment: {
      chemical: treatments[0] || "No chemical treatment provided",
      organic: treatments[1] || "No organic alternative provided",
      prevention: apiResult?.prevention || "Maintain regular crop hygiene",
    },
  };
}

function toStatus(severity?: ApiDetectResult["severity"]): RecentDiagnosis["status"] {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    case "none":
    default:
      return "healthy";
  }
}

function saveRecentDiagnosis(record: RecentDiagnosis) {
  if (typeof window === "undefined") return;
  try {
    const key = "agritech_recent_diagnoses";
    const existing = localStorage.getItem(key);
    const items = existing ? (JSON.parse(existing) as RecentDiagnosis[]) : [];
    const next = [record, ...items].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "High": return "text-red-400 bg-red-500/10 border-red-500/20";
    case "Moderate": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "Low": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    default: return "text-green-400 bg-green-500/10 border-green-500/20";
  }
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function DetectPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TreatmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"treatment" | "prevention">("treatment");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentUploads, setRecentUploads] = useState<string[]>([]);
  const diseaseClassDetails = [
    {
      name: "Bacterial Spot",
      description:
        "Small dark, water-soaked lesions on leaves and fruit, often with yellow halos. Caused by Xanthomonas bacteria.",
    },
    {
      name: "Early Blight",
      description:
        "Dark brown concentric rings (target spots) on older leaves, starting from the bottom of the plant. Caused by Alternaria solani.",
    },
    {
      name: "Healthy Leaf",
      description:
        "Normal green foliage with no visible symptoms, useful as a baseline or pass/fail check.",
    },
    {
      name: "Late Blight",
      description:
        "Large, irregular olive-green to brown blotches on leaves with white fungal growth on the underside in wet conditions. Caused by Phytophthora infestans.",
    },
    {
      name: "Molds",
      description: "Powdery or fuzzy fungal growth visible on leaf surfaces.",
    },
    {
      name: "Mosaic Virus",
      description:
        "Mottled light and dark green patches on leaves, often accompanied by leaf curling or stunted growth.",
    },
    {
      name: "Septoria",
      description:
        "Small circular spots with dark borders and grayish centers on leaves, often with tiny black fungal fruiting bodies. Caused by Septoria lycopersici.",
    },
    {
      name: "Yellow Curl Virus",
      description:
        "Upward leaf curling, yellowing of leaf edges, and stunted shoot growth.",
    },
  ];

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setRecentUploads((prev) => [dataUrl, ...prev].slice(0, 3));
      setStage("scanning");
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/detect", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("[detect] /api/detect response", data);

        if (!res.ok) {
          throw new Error(data.error || "Detection failed");
        }
        setResult(toTreatmentResult(data));
        const apiResult: ApiDetectResult | undefined = data?.result ?? data;
        const confidenceRaw = apiResult?.confidence ?? 0;
        const confidence = Math.round(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw);
        const isHealthy = apiResult?.isHealthy || apiResult?.severity === "none";
        const diseaseName = apiResult?.displayName || apiResult?.label || "Unknown";
        saveRecentDiagnosis({
          id: Date.now(),
          crop: apiResult?.crop || "Plant",
          disease: isHealthy ? "No disease detected" : diseaseName,
          date: new Date().toISOString().slice(0, 10),
          confidence,
          status: toStatus(apiResult?.severity),
        });
        setStage("done");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setStage("error");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStage("idle");
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:h-[calc(100vh-120px)]">
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#e5e2e1]"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          AI Crop Diagnosis
        </h1>
        <p
          className="text-sm text-[#8a9386] mt-1"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Upload or capture high-resolution crop imagery for AI analysis
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* ── Left column: image panel ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-[#1c1b1b] border border-[#41493e] text-[#c0c9bb] hover:border-[#91d78a]/40 hover:text-[#91d78a] w-full sm:w-auto"
            >
              <Upload size={15} />
              Upload Image
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-[#1b5e20] text-white hover:bg-[#2e7d32] w-full sm:w-auto"
            >
              <Camera size={15} />
              Take Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileInput}
            />
          </div>

          {/* Main image area */}
          <div
            className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-300 bg-[#1c1b1b] border",
              isDragging ? "border-[#91d78a] ring-2 ring-[#91d78a]/20" : "border-[#41493e]",
              "min-h-[320px] aspect-video"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(#91d78a 1px, transparent 1px), linear-gradient(90deg, #91d78a 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Image or placeholder */}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Crop scan"
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#1b5e20]/10 border border-[#91d78a]/20">
                  <Upload size={22} className="text-[#91d78a]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#c0c9bb]">
                    Drop an image here or click to upload
                  </p>
                  <p className="text-xs text-[#8a9386] mt-1">
                    JPG, PNG • Max 10MB
                  </p>
                </div>
              </div>
            )}

            {/* Scan line animation */}
            {stage === "scanning" && (
              <div className="absolute inset-0 bg-black/50">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#91d78a] animate-pulse" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1b5e20]/80 border border-[#91d78a]/30 text-[#91d78a]">
                  ◉ SCANNING — Analyzing leaf structure
                </div>
              </div>
            )}

            {/* Disease detection box overlay */}
            {stage === "done" && result && result.disease !== "No disease detected" && (
              <>
                <div
                  className="absolute border-2 border-[#91d78a] shadow-lg shadow-[#91d78a]/20"
                  style={{
                    top: "28%", left: "32%",
                    width: "36%", height: "38%",
                  }}
                />
                <div
                  className="absolute text-xs px-2.5 py-1 font-medium bg-[#1c1b1b]/90 border border-[#91d78a] text-[#91d78a] rounded"
                  style={{ top: "calc(28% - 28px)", left: "32%" }}
                >
                  ◉ DETECTED: {(result.disease ?? "Unknown").toUpperCase()}
                </div>
              </>
            )}

            {/* Healthy overlay */}
            {stage === "done" && result?.disease === "No disease detected" && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 border border-green-500/30 text-green-400">
                <CheckCircle size={12} />
                CROP HEALTHY — NO DISEASE DETECTED
              </div>
            )}

            {/* Error overlay */}
            {stage === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center px-6">
                  <AlertTriangle size={28} className="mx-auto mb-2 text-red-400" />
                  <p className="text-sm text-[#c0c9bb]">{error}</p>
                  <button
                    onClick={reset}
                    className="mt-3 text-xs underline text-[#8a9386] hover:text-[#91d78a]"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Controls row inside image */}
            {previewUrl && (
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#8a9386]">
                  <div className="flex items-center gap-1.5">
                    <span>Exposure</span>
                    <div className="w-14 h-1 rounded-full overflow-hidden bg-[#41493e]">
                      <div className="h-full rounded-full bg-[#91d78a]" style={{ width: "55%" }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-black/50 border border-[#41493e] hover:border-[#91d78a]">
                    <ZoomIn size={12} className="text-[#8a9386]" />
                  </button>
                  <button
                    onClick={reset}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
                  >
                    <RotateCcw size={12} className="text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent uploads strip */}
          {recentUploads.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase mb-3 text-[#8a9386]">
                Recent Uploads
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {recentUploads.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPreviewUrl(url);
                    }}
                    className={cn(
                      "w-20 h-16 rounded-lg overflow-hidden relative border",
                      i === 0 ? "border-[#91d78a]" : "border-[#41493e]"
                    )}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1b5e20]/30">
                        <CheckCircle size={14} className="text-[#91d78a]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: results panel ── */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col bg-[#1c1b1b] border border-[#41493e] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#41493e]">
            <h2
              className="text-base font-bold text-[#e5e2e1]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Diagnostic Results
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="rounded-xl border border-[#41493e] bg-[#131313] p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#8a9386]">Dataset</p>
                  <p className="text-sm font-semibold text-[#e5e2e1] mt-1">Plant Disease Finder</p>
                </div>
                <div className="text-right text-[11px] text-[#8a9386]">
                  <p>Object detection</p>
                  <p>2,307 images</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8a9386] mb-3">
                <div className="flex items-center gap-2">
                  <Leaf size={12} className="text-[#91d78a]" />
                  8 classes
                </div>
                <div className="flex items-center gap-2">
                  <Grid3x3 size={12} className="text-[#91d78a]" />
                  Leaf-focused labels
                </div>
              </div>
              <div className="space-y-2">
                {diseaseClassDetails.map((item) => (
                  <div key={item.name} className="rounded-lg border border-[#2a2f2a] bg-[#161616] p-2">
                    <p className="text-xs font-semibold text-[#c0c9bb]">{item.name}</p>
                    <p className="text-[11px] text-[#8a9386] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Loading skeleton */}
            {stage === "scanning" && (
              <div className="space-y-4">
                <div className="h-28 rounded-xl bg-[#131313] border border-[#41493e] animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-[#131313] animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-[#131313] animate-pulse" />
                <div className="h-32 rounded-xl bg-[#131313] animate-pulse mt-4" />
              </div>
            )}

            {/* Empty state */}
            {stage === "idle" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#1b5e20]/10 border border-[#91d78a]/20">
                  <Microscope size={22} className="text-[#91d78a]/50" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#8a9386]">
                    Upload an image to begin
                  </p>
                  <p className="text-xs text-[#41493e] mt-1">
                    AI analysis results will appear here
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {stage === "done" && result && (
              <div className="space-y-4">
                {/* Severity Card */}
                <div className="bg-[#131313] rounded-xl p-4 border border-[#41493e]">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md border", getSeverityColor(result.severity))}>
                      {result.severity === "High" ? (
                        <AlertTriangle size={10} />
                      ) : (
                        <CheckCircle size={10} />
                      )}
                      {result.disease === "No disease detected" ? "Healthy Crop" : `${result.severity} Severity`}
                    </div>
                    <span className="text-xs text-[#8a9386]">
                      Confidence: <span className="text-[#91d78a]">{result.confidence}%</span>
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[#e5e2e1]">
                    {result.disease}
                  </p>
                  <p className="text-xs text-[#8a9386] mt-1">
                    {result.recommendation}
                  </p>
                </div>

                {/* Treatment / Prevention Tabs */}
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    <button
                      onClick={() => setActiveTab("treatment")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        activeTab === "treatment"
                          ? "bg-[#1b5e20]/20 text-[#91d78a] border border-[#91d78a]/30"
                          : "text-[#8a9386] hover:text-[#c0c9bb]"
                      )}
                    >
                      <FlaskConical size={11} />
                      Treatment
                    </button>
                    <button
                      onClick={() => setActiveTab("prevention")}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        activeTab === "prevention"
                          ? "bg-[#1b5e20]/20 text-[#91d78a] border border-[#91d78a]/30"
                          : "text-[#8a9386] hover:text-[#c0c9bb]"
                      )}
                    >
                      <ShieldCheck size={11} />
                      Prevention
                    </button>
                  </div>

                  {activeTab === "treatment" && result.disease !== "No disease detected" && (
                    <div className="space-y-3">
                      <div className="bg-[#131313] rounded-lg p-3 border border-[#41493e]">
                        <p className="text-xs font-medium text-[#91d78a] mb-1">Chemical Treatment</p>
                        <p className="text-sm text-[#c0c9bb]">
                          {result.treatment?.chemical || "No chemical treatment provided"}
                        </p>
                      </div>
                      <div className="bg-[#131313] rounded-lg p-3 border border-[#41493e]">
                        <p className="text-xs font-medium text-[#91d78a] mb-1">Organic Alternative</p>
                        <p className="text-sm text-[#c0c9bb]">
                          {result.treatment?.organic || "No organic alternative provided"}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "prevention" && result.disease !== "No disease detected" && (
                    <div className="bg-[#131313] rounded-lg p-4 border border-[#41493e]">
                      <div className="flex items-start gap-3">
                        <ShieldCheck size={14} className="text-[#91d78a] mt-0.5" />
                        <p className="text-sm text-[#c0c9bb] leading-relaxed">
                          {result.treatment?.prevention || "Maintain regular crop hygiene"}
                        </p>
                      </div>
                    </div>
                  )}

                  {result.disease === "No disease detected" && (
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 text-center">
                      <CheckCircle size={24} className="mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-green-400">Your crop appears healthy!</p>
                      <p className="text-xs text-[#8a9386] mt-1">Continue regular monitoring</p>
                    </div>
                  )}
                </div>

                {/* Weather & Soil Context */}
                <div className="bg-[#131313] rounded-xl p-4 border border-[#41493e]">
                  <p className="text-xs font-semibold text-[#8a9386] mb-3">Field Context</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <Droplets className="w-4 h-4 text-[#91d78a] mx-auto mb-1" />
                      <p className="text-xs text-[#c0c9bb]">62%</p>
                      <p className="text-[10px] text-[#8a9386]">Moisture</p>
                    </div>
                    <div className="text-center">
                      <Thermometer className="w-4 h-4 text-[#91d78a] mx-auto mb-1" />
                      <p className="text-xs text-[#c0c9bb]">28°C</p>
                      <p className="text-[10px] text-[#8a9386]">Temp</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-4 h-4 text-[#91d78a] mx-auto mb-1" />
                      <p className="text-xs text-[#c0c9bb]">12km/h</p>
                      <p className="text-[10px] text-[#8a9386]">Wind</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={reset}
                    className="flex-1 bg-[#201f1f] border border-[#41493e] text-[#c0c9bb] py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
                  >
                    New Scan
                  </button>
                  {result.disease !== "No disease detected" && (
                    <button className="flex-1 bg-[#91d78a] text-[#003909] py-2 rounded-lg hover:bg-[#acf4a4] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Buy Treatment
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error state */}
            {stage === "error" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
                <AlertTriangle size={28} className="text-red-400" />
                <div>
                  <p className="text-sm font-medium text-[#c0c9bb]">Detection failed</p>
                  <p className="text-xs text-[#8a9386] mt-1">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"
                >
                  <RotateCcw size={11} />
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

