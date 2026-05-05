// app/api/detect/route.ts
import { NextRequest, NextResponse } from "next/server";

// ─── Treatment recommendations map ────────────────────────────────────────────
const TREATMENT_MAP: Record<string, {
  severity: "none" | "low" | "medium" | "high" | "critical";
  vitalityPenalty: number; // subtracted from 100
  treatments: string[];
  prevention: string;
}> = {
  // Fungal diseases
  "Tomato___Septoria_leaf_spot": {
    severity: "high",
    vitalityPenalty: 38,
    treatments: [
      "Apply copper-based fungicide (copper hydroxide) within 48 hours",
      "Remove and bag all infected leaves — do not compost",
      "Reduce evening irrigation to limit leaf-surface moisture duration",
      "Apply potassium-rich foliar feed to strengthen plant immunity",
    ],
    prevention: "Rotate crops annually; use disease-resistant varieties next season",
  },
  "Tomato___Late_blight": {
    severity: "critical",
    vitalityPenalty: 65,
    treatments: [
      "IMMEDIATE: Isolate infected plants from healthy crop",
      "Apply Mancozeb or chlorothalonil fungicide to entire field",
      "Destroy (burn or bag) heavily infected plants — do not compost",
      "Monitor neighboring fields — late blight spreads rapidly",
    ],
    prevention: "Plant certified blight-free seed; avoid overhead irrigation",
  },
  "Tomato___Early_blight": {
    severity: "medium",
    vitalityPenalty: 28,
    treatments: [
      "Apply chlorothalonil or copper fungicide every 7–10 days",
      "Remove lower infected leaves to improve airflow",
      "Mulch around base to prevent soil splash onto leaves",
    ],
    prevention: "Stake plants to improve circulation; rotate tomato family crops",
  },
  "Tomato___Leaf_Mold": {
    severity: "medium",
    vitalityPenalty: 22,
    treatments: [
      "Improve greenhouse ventilation or open-field airflow",
      "Apply copper-based fungicide spray",
      "Reduce humidity by adjusting irrigation to morning only",
    ],
    prevention: "Use mold-resistant varieties; maintain relative humidity below 85%",
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    severity: "high",
    vitalityPenalty: 50,
    treatments: [
      "No chemical cure — control whitefly vector immediately",
      "Apply insecticidal soap or neem oil for whitefly management",
      "Remove and destroy infected plants to prevent spread",
      "Install reflective mulch to deter whitefly landing",
    ],
    prevention: "Use TYLCV-resistant varieties; install insect-proof netting",
  },
  "Tomato___Bacterial_spot": {
    severity: "high",
    vitalityPenalty: 42,
    treatments: [
      "Apply copper bactericide (copper sulfate + mancozeb) spray",
      "Avoid working in field when plants are wet",
      "Remove heavily spotted leaves and dispose securely",
    ],
    prevention: "Use disease-free seed; avoid overhead irrigation",
  },

  // Corn diseases
  "Corn___Common_rust": {
    severity: "medium",
    vitalityPenalty: 25,
    treatments: [
      "Apply triazole-based fungicide (propiconazole) immediately",
      "Scout field weekly — rust spreads rapidly in warm humid conditions",
      "Remove and bag heavily infected leaves from borders",
    ],
    prevention: "Plant rust-resistant hybrids; avoid dense planting",
  },
  "Corn___Northern_Leaf_Blight": {
    severity: "high",
    vitalityPenalty: 40,
    treatments: [
      "Apply strobilurin fungicide at VT/R1 growth stage",
      "Increase plant spacing in next planting for airflow",
      "Scout regularly during tasseling period",
    ],
    prevention: "Use resistant hybrids; till to reduce surface crop residue",
  },
  "Corn___Gray_leaf_spot": {
    severity: "medium",
    vitalityPenalty: 30,
    treatments: [
      "Apply foliar fungicide (azoxystrobin or propiconazole)",
      "Improve field drainage to reduce leaf wetness periods",
    ],
    prevention: "Rotate with non-host crops; choose tolerant hybrids",
  },

  // Potato diseases
  "Potato___Late_blight": {
    severity: "critical",
    vitalityPenalty: 70,
    treatments: [
      "URGENT: Apply mancozeb or metalaxyl-M fungicide immediately",
      "Destroy all infected plant material — do not compost",
      "Hilling soil around stems can reduce spread",
      "Monitor daily — late blight can destroy a field in days",
    ],
    prevention: "Use certified disease-free seed tubers; apply preventive fungicide",
  },
  "Potato___Early_blight": {
    severity: "medium",
    vitalityPenalty: 28,
    treatments: [
      "Apply chlorothalonil or copper-based fungicide",
      "Remove lower infected leaves promptly",
      "Ensure adequate potassium nutrition to reduce stress",
    ],
    prevention: "Rotate potatoes with non-solanaceous crops for 3 years",
  },

  // Apple diseases
  "Apple___Apple_scab": {
    severity: "medium",
    vitalityPenalty: 25,
    treatments: [
      "Apply myclobutanil or captan fungicide during primary infection period",
      "Rake and remove fallen leaves to eliminate overwintering spores",
      "Prune to open canopy and improve air circulation",
    ],
    prevention: "Plant scab-resistant apple varieties",
  },
  "Apple___Black_rot": {
    severity: "high",
    vitalityPenalty: 45,
    treatments: [
      "Apply captan or thiophanate-methyl fungicide",
      "Remove mummified fruit from tree and ground",
      "Prune dead or cankered wood — sanitize tools between cuts",
    ],
    prevention: "Maintain tree vigor with proper fertilization and irrigation",
  },
  "Apple___Cedar_apple_rust": {
    severity: "medium",
    vitalityPenalty: 30,
    treatments: [
      "Apply myclobutanil or triadimefon fungicide at pink stage",
      "Remove nearby Eastern red cedar trees if feasible",
    ],
    prevention: "Plant rust-resistant apple varieties near cedar trees",
  },

  // Grape diseases
  "Grape___Black_rot": {
    severity: "high",
    vitalityPenalty: 48,
    treatments: [
      "Apply mancozeb or myclobutanil fungicide preventively",
      "Remove all mummified berries and infected clusters",
      "Improve canopy management for better air circulation",
    ],
    prevention: "Prune vines aggressively; apply dormant lime-sulfur spray",
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    severity: "medium",
    vitalityPenalty: 22,
    treatments: [
      "Apply copper-based fungicide spray",
      "Remove infected leaves and dispose securely",
    ],
    prevention: "Maintain good canopy airflow; avoid overhead irrigation",
  },

  // Healthy — no action needed
  "Tomato___healthy": {
    severity: "none",
    vitalityPenalty: 2,
    treatments: ["Continue current care regimen", "Next recommended scan: 14 days"],
    prevention: "Maintain crop monitoring; scout for early disease indicators weekly",
  },
  "Corn___healthy": {
    severity: "none",
    vitalityPenalty: 2,
    treatments: ["No action required", "Continue routine scouting"],
    prevention: "Monitor for pest pressure; ensure adequate soil nutrition",
  },
  "Potato___healthy": {
    severity: "none",
    vitalityPenalty: 3,
    treatments: ["Crop appears healthy", "Maintain current irrigation and nutrition program"],
    prevention: "Scout weekly during high-humidity periods for early blight signs",
  },
  "Apple___healthy": {
    severity: "none",
    vitalityPenalty: 2,
    treatments: ["Tree appears healthy", "Continue orchard management program"],
    prevention: "Apply dormant oil spray before bud break next season",
  },
  "Grape___healthy": {
    severity: "none",
    vitalityPenalty: 2,
    treatments: ["Vine appears healthy", "Continue canopy management"],
    prevention: "Monitor for downy and powdery mildew during warm humid weather",
  },
};

// Fallback for unknown labels
function getFallbackTreatment(label: string) {
  return {
    severity: "medium" as const,
    vitalityPenalty: 30,
    treatments: [
      `Isolate affected plants pending expert confirmation`,
      `Consult your local agricultural extension office`,
      `Document symptoms with additional photos from multiple angles`,
    ],
    prevention: "Maintain general crop hygiene and rotation practices",
  };
}

// ─── Roboflow API call ─────────────────────────────────────────────────────────
async function detectWithRoboflow(imageBase64: string): Promise<{
  label: string | null;
  confidence: number;
  rawResponse: unknown;
}> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  const modelId = process.env.ROBOFLOW_MODEL_ID || "plant-disease-detection/1";
  const params = new URLSearchParams({
    api_key: apiKey || "",
    confidence: "0.2",
    overlap: "0.3",
  });
  const apiUrl = `https://detect.roboflow.com/${modelId}?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: imageBase64,
  });

  const rawText = await response.text();
  let data: any = null;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (parseError) {
    const preview = rawText?.slice(0, 200) || "<empty>";
    throw new Error(`Roboflow API returned non-JSON response: ${preview}`);
  }

  if (!response.ok) {
    throw new Error(`Roboflow API error ${response.status}: ${rawText}`);
  }

  const predictionCount = Array.isArray(data?.predictions)
    ? data.predictions.length
    : typeof data?.predictions === "object" && data?.predictions
      ? Object.keys(data.predictions).length
      : 0;

  let topPrediction: { class: string; confidence: number } | null = null;

  // Roboflow detection response shape:
  // { predictions: [{ class: "Label", confidence: 0.92, ... }], image: {...} }
  if (Array.isArray(data?.predictions) && data.predictions.length > 0) {
    topPrediction = data.predictions
      .sort((a: { confidence: number }, b: { confidence: number }) => b.confidence - a.confidence)[0];
  } else if (data?.predictions && typeof data.predictions === "object") {
    const entries = Object.entries(data.predictions)
      .filter(([, value]) => typeof value === "number") as Array<[string, number]>;
    if (entries.length > 0) {
      const [label, confidence] = entries.sort((a, b) => b[1] - a[1])[0];
      topPrediction = { class: label, confidence };
    }
  }

  console.log("[/api/detect] Roboflow response keys:", Object.keys(data ?? {}));
  console.log("[/api/detect] Predictions:", predictionCount, topPrediction?.class, topPrediction?.confidence);
  if (!topPrediction) {
    console.log("[/api/detect] Empty predictions payload:", data?.predictions);
  }

  if (!topPrediction) {
    return { label: null, confidence: 0, rawResponse: data };
  }

  const label = topPrediction.class as string;
  const confidenceRaw = topPrediction.confidence as number;
  const confidence = Math.round(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw);

  return { label, confidence, rawResponse: data };
}

async function classifyWithRoboflow(imageBase64: string): Promise<{
  label: string | null;
  confidence: number;
  rawResponse: unknown;
}> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  const modelId = process.env.ROBOFLOW_MODEL_ID || "plant-disease-detection/1";
  const params = new URLSearchParams({
    api_key: apiKey || "",
  });
  const apiUrl = `https://classify.roboflow.com/${modelId}?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: imageBase64,
  });

  const rawText = await response.text();
  let data: any = null;

  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (parseError) {
    const preview = rawText?.slice(0, 200) || "<empty>";
    throw new Error(`Roboflow classify returned non-JSON response: ${preview}`);
  }

  if (!response.ok) {
    throw new Error(`Roboflow classify error ${response.status}: ${rawText}`);
  }

  const predictionList = Array.isArray(data?.predictions) ? data.predictions : [];
  const topPrediction = predictionList
    .sort((a: { confidence: number }, b: { confidence: number }) => b.confidence - a.confidence)[0];

  if (!topPrediction) {
    console.log("[/api/detect] Classify predictions empty:", data?.predictions);
    return { label: null, confidence: 0, rawResponse: data };
  }

  const label = topPrediction.class as string;
  const confidenceRaw = topPrediction.confidence as number;
  const confidence = Math.round(confidenceRaw <= 1 ? confidenceRaw * 100 : confidenceRaw);

  return { label, confidence, rawResponse: data };
}

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let imageDataUrl: string | null = null;

    if (contentType.includes("application/json")) {
      const body = (await req.json()) as { image?: string };
      imageDataUrl = body.image ?? null;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");

      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type || "image/jpeg";
        imageDataUrl = `data:${mimeType};base64,${base64}`;
      }
    }

    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.ROBOFLOW_API_KEY) {
      return NextResponse.json(
        { error: "ROBOFLOW_API_KEY not configured in .env.local" },
        { status: 500 }
      );
    }

    // Strip data URL prefix — Roboflow expects raw base64
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

    const detection = await detectWithRoboflow(base64Data);
    let label = detection.label;
    let confidence = detection.confidence;

    if (!label) {
      console.log("[/api/detect] Falling back to classify endpoint");
      const classification = await classifyWithRoboflow(base64Data);
      label = classification.label;
      confidence = classification.confidence;
    }

    if (!label) {
      return NextResponse.json({
        success: true,
        result: {
          label: "Unknown",
          displayName: "No Disease Detected",
          crop: "Plant",
          confidence: 0,
          severity: "none",
          vitality: 98,
          treatments: ["No action required", "Continue routine monitoring"],
          prevention: "Maintain regular scouting and proper crop hygiene",
          isHealthy: true,
        },
      });
    }

    // Look up treatment protocol
    const treatment = TREATMENT_MAP[label] ?? getFallbackTreatment(label);
    const vitality = Math.max(10, 100 - treatment.vitalityPenalty);

    // Format the disease name for display (e.g. "Tomato___Early_blight" → "Early Blight")
    const displayName = label
      .replace(/^[^_]+___/, "")       // remove "Tomato___"
      .replace(/_/g, " ")              // underscores → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case

    const crop = label.split("___")[0] ?? "Plant";

    return NextResponse.json({
      success: true,
      result: {
        label,
        displayName,
        crop,
        confidence,
        severity: treatment.severity,
        vitality,
        treatments: treatment.treatments,
        prevention: treatment.prevention,
        isHealthy: treatment.severity === "none",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/detect] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}