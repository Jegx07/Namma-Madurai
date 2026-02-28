const express = require("express");
const cors = require("cors");
const vision = require("@google-cloud/vision");

// ============================================
// SERVER CONFIGURATION
// ============================================
const PORT = 5000;
const MAX_IMAGE_SIZE = "50mb";

// ============================================
// EXPRESS APP SETUP
// ============================================
const app = express();

// CORS Configuration - Allow all origins for development
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

// Body parser for large base64 images
app.use(express.json({ limit: MAX_IMAGE_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_IMAGE_SIZE }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// GOOGLE CLOUD VISION CLIENT
// ============================================
console.log(`[CONFIG] Loading Vision API credentials from: ./vision-key.json`);

let client;
try {
  client = new vision.ImageAnnotatorClient({
    keyFilename: "./vision-key.json"
  });
  console.log("[CONFIG] Vision API client initialized successfully");
} catch (error) {
  console.error("[ERROR] Failed to initialize Vision API client:", error.message);
  process.exit(1);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateSummary(labels, objects, wasteDetected) {
  const topLabels = labels.slice(0, 5).map(l => l.description).join(", ");
  const topObjects = objects.slice(0, 5).map(o => o.name).join(", ");
  
  let summary = `I can see: ${topLabels || "various items"}.`;
  
  if (topObjects) {
    summary += ` Objects detected: ${topObjects}.`;
  }
  
  if (wasteDetected.length > 0) {
    summary += ` Waste-related items found: ${wasteDetected.join(", ")}. Consider proper disposal or recycling.`;
  }
  
  return summary;
}

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Backend working" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Clean Madurai Vision API Server",
    endpoints: ["/analyze", "/analyze/full", "/analyze/objects", "/health"],
    status: "running"
  });
});

// Simple label detection endpoint
app.post("/analyze", async (req, res) => {
  console.log("[ANALYZE] Received label detection request");
  
  try {
    const base64Image = req.body.image;

    if (!base64Image) {
      console.log("[ANALYZE] Error: No image provided");
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("[ANALYZE] Processing image, size:", base64Image.length, "bytes");

    const [result] = await client.labelDetection({
      image: { content: base64Image }
    });

    const labels = result.labelAnnotations?.map(l => ({
      description: l.description,
      score: l.score
    })) || [];

    console.log("[ANALYZE] Detected", labels.length, "labels");
    res.json({ labels, success: true });
  } catch (error) {
    console.error("[ANALYZE] Vision API Error:", error.message);
    res.status(500).json({ error: error.message, success: false });
  }
});

// Object localization endpoint
app.post("/analyze/objects", async (req, res) => {
  console.log("[OBJECTS] Received object detection request");
  
  try {
    const base64Image = req.body.image;

    if (!base64Image) {
      console.log("[OBJECTS] Error: No image provided");
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("[OBJECTS] Processing image, size:", base64Image.length, "bytes");

    const [result] = await client.objectLocalization({
      image: { content: base64Image }
    });

    const objects = result.localizedObjectAnnotations?.map(obj => ({
      name: obj.name,
      score: obj.score
    })) || [];

    console.log("[OBJECTS] Detected", objects.length, "objects");
    res.json({ objects, success: true });
  } catch (error) {
    console.error("[OBJECTS] Vision API Error:", error.message);
    res.status(500).json({ error: error.message, success: false });
  }
});

// Full analysis endpoint (labels + objects + waste detection)
app.post("/analyze/full", async (req, res) => {
  console.log("[FULL] Received full analysis request");
  
  try {
    const base64Image = req.body.image;

    if (!base64Image) {
      console.log("[FULL] Error: No image provided");
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("[FULL] Processing image, size:", base64Image.length, "bytes");

    // Run multiple detections in parallel
    const [labelResult, objectResult] = await Promise.all([
      client.labelDetection({ image: { content: base64Image } }),
      client.objectLocalization({ image: { content: base64Image } })
    ]);

    const labels = labelResult[0].labelAnnotations?.map(l => ({
      description: l.description,
      score: l.score
    })) || [];

    const objects = objectResult[0].localizedObjectAnnotations?.map(obj => ({
      name: obj.name,
      score: obj.score
    })) || [];

    // Categorize for waste/cleanliness context
    const wasteKeywords = ['garbage', 'trash', 'waste', 'plastic', 'bottle', 'can', 'paper', 'debris', 'litter', 'recyclable', 'organic', 'water'];
    const cleanlinessKeywords = ['clean', 'dirty', 'pollution', 'contamination', 'hygiene'];
    
    const allLabels = labels.map(l => l.description.toLowerCase());
    const detectedWaste = allLabels.filter(l => wasteKeywords.some(k => l.includes(k)));
    const cleanlinessIndicators = allLabels.filter(l => cleanlinessKeywords.some(k => l.includes(k)));

    console.log("[FULL] Labels:", labels.length, "Objects:", objects.length, "Waste items:", detectedWaste.length);

    res.json({
      labels,
      objects,
      wasteDetected: detectedWaste,
      cleanlinessIndicators,
      summary: generateSummary(labels, objects, detectedWaste),
      success: true
    });
  } catch (error) {
    console.error("[FULL] Vision API Error:", error.message);
    res.status(500).json({ error: error.message, success: false });
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error("[ERROR] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error", success: false });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", success: false });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, "0.0.0.0", () => {
  console.log("============================================");
  console.log(`  Clean Madurai Vision API Server`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`    GET  /health       - Health check`);
  console.log(`    POST /analyze      - Label detection`);
  console.log(`    POST /analyze/full - Full analysis`);
  console.log("============================================");
});
