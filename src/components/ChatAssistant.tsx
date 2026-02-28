import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Image as ImageIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = {
  role: "user" | "assistant";
  content: string;
  buttons?: string[];
  imageUrl?: string;
};

const VISION_API_URL = "http://localhost:5000/analyze/full";

const TOPIC_BUTTONS = [
  "♻️ Waste Segregation",
  "🚻 Public Toilets",
  "📱 E-Waste Disposal",
  "🌱 Composting Tips",
  "🚫 Plastic Ban Rules",
  "📢 Report a Complaint",
  "💧 Water Supply Info",
];

const WELCOME_MSG = `Vanakkam! 🙏 Welcome to Clean Madurai Assistant.\nHow can I help you today?`;

// Smart offline responses matching user's exact spec
const getOfflineResponse = (userText: string): { text: string; buttons?: string[] } => {
  const q = userText.toLowerCase();

  // Greeting
  if (
    q.includes("hi") || q.includes("hello") || q.includes("hey") ||
    q.includes("vanakam") || q.includes("vanakkam") || q.includes("hii") ||
    q.includes("helo") || q === "start"
  ) {
    return {
      text: WELCOME_MSG,
      buttons: TOPIC_BUTTONS,
    };
  }

  // Waste Segregation
  if (
    q.includes("waste") || q.includes("segregat") || q.includes("garbage") ||
    q.includes("dustbin") || q.includes("trash") || q.includes("bin")
  ) {
    return {
      text: `♻️ Waste Segregation Guide (Madurai)\n\n🟢 Green – Wet Waste (Food, vegetables)\n🔵 Blue – Recyclables (Paper, plastic bottles)\n⚫ Black – Non-recyclable waste\n🔴 Red – Hazardous waste (batteries, medicines)\n\nPlease separate wet and dry waste before 8 AM.\nGarbage collection is done ward-wise by Madurai City Corporation.`,
    };
  }

  // Public Toilets
  if (
    q.includes("toilet") || q.includes("restroom") || q.includes("bathroom") || q.includes("washroom")
  ) {
    return {
      text: `🚻 Nearest Public Toilets in Madurai:\n\n• Periyar Bus Stand (24/7)\n• Mattuthavani Bus Stand\n• Near Meenakshi Amman Temple\n• Railway Junction (Platform 1)\n• Tallakulam TNSTC Stand\n\nReport unclean toilets through the municipal complaint system.`,
    };
  }

  // E-Waste
  if (
    q.includes("e-waste") || q.includes("ewaste") || q.includes("electronic") ||
    q.includes("battery") || q.includes("mobile") || q.includes("laptop") ||
    q.includes("charger") || q.includes("computer")
  ) {
    return {
      text: `📱 E-Waste Disposal\n\nItems accepted:\n• Old mobiles\n• Batteries\n• Chargers\n• Laptops\n\nPlease do not throw e-waste in regular bins.\nUse authorized collection centers or retailer take-back services.\n\nCall 1800-599-0808 (Swachh helpline) for pickup requests.`,
    };
  }

  // Composting
  if (
    q.includes("compost") || q.includes("organic") || q.includes("manure") || q.includes("fertilizer")
  ) {
    return {
      text: `🌱 Composting Tips\n\n• Home composting: Use a khamba pot or a simple pit to convert kitchen waste into manure.\n• Community centers: Vilangudi Compost Yard and Vellakkal Compost Center accept organic waste.\n• Tip: Avoid adding dairy, meat, or oily food to your compost pile.\n\nMadurai Corporation distributes free composting bins — contact your ward office!`,
    };
  }

  // Plastic Ban
  if (
    q.includes("plastic") || q.includes("ban") || q.includes("straw") ||
    q.includes("carry bag") || q.includes("cup")
  ) {
    return {
      text: `🚫 Plastic Ban Awareness\n\nSingle-use plastics banned in Tamil Nadu:\n• Plastic carry bags\n• Plastic plates & cups\n• Plastic straws\n\nUse cloth bags or reusable containers to support Clean Madurai.\nReport violations to TN Pollution Control Board (044-2235 0700).`,
    };
  }

  // Report / Complaint
  if (
    q.includes("report") || q.includes("complaint") || q.includes("dump") ||
    q.includes("illegal") || q.includes("issue") || q.includes("problem")
  ) {
    return {
      text: `📢 Report a Complaint\n\nPlease provide:\n1️⃣ Area name\n2️⃣ Landmark\n3️⃣ Issue type (garbage, drainage, etc.)\n\nYour complaint will be forwarded to the municipal authority.\n\nOr use these channels:\n• Swachh Bharat App — snap a photo and submit\n• Call Madurai Corporation: 0452-253 0860\n• Online: https://madurai.nic.in (grievance portal)`,
    };
  }

  // Water Supply
  if (
    q.includes("water") || q.includes("drinking") || q.includes("bore") || q.includes("supply")
  ) {
    return {
      text: `💧 Water Supply Info\n\nWater supply in Madurai is scheduled ward-wise.\n• Morning: 5 AM – 8 AM\n• Evening: 4 PM – 6 PM (varies by zone)\n• RO water ATMs available at major junctions (₹5 per 20L)\n\nPlease check your local ward timing or contact the municipal office.\nReport water issues: 0452-253 0860`,
    };
  }

  // Thank you
  if (q.includes("thank") || q.includes("thanks") || q.includes("nandri")) {
    return {
      text: `Nandri! 🙏 Happy to help. Let's keep Madurai clean together!\nFeel free to ask anything else.`,
      buttons: TOPIC_BUTTONS,
    };
  }

  // About
  if (q.includes("who") || q.includes("what are you") || q.includes("about")) {
    return {
      text: `I'm the Clean Madurai Assistant 🌿 — a chatbot built to help citizens of Madurai with sanitation, waste management, and cleanliness information.\n\nI'm part of the NAMMA MADURAI initiative to make our beloved city cleaner, greener, and healthier!`,
      buttons: TOPIC_BUTTONS,
    };
  }

  // Default fallback
  return {
    text: `I can help you with the following topics. Please select one:`,
    buttons: TOPIC_BUTTONS,
  };
};

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: WELCOME_MSG,
      buttons: TOPIC_BUTTONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        // Extract just the base64 data without the data URL prefix
        const base64Data = base64.split(',')[1];
        setSelectedImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImageWithVision = async (base64Image: string): Promise<string> => {
    try {
      const response = await fetch(VISION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (!response.ok) {
        throw new Error('Vision API request failed');
      }

      const data = await response.json();

      // Format the response for the chat
      let analysisText = "📸 **Image Analysis Results:**\n\n";

      if (data.summary) {
        analysisText += `${data.summary}\n\n`;
      }

      if (data.labels && data.labels.length > 0) {
        const topLabels = data.labels.slice(0, 8).map((l: { description: string, score: number }) =>
          `• ${l.description} (${Math.round(l.score * 100)}%)`
        ).join('\n');
        analysisText += `**Labels detected:**\n${topLabels}\n\n`;
      }

      if (data.objects && data.objects.length > 0) {
        const topObjects = data.objects.slice(0, 5).map((o: { name: string, score: number }) =>
          `• ${o.name} (${Math.round(o.score * 100)}%)`
        ).join('\n');
        analysisText += `**Objects found:**\n${topObjects}\n\n`;
      }

      if (data.wasteDetected && data.wasteDetected.length > 0) {
        analysisText += `♻️ **Waste items detected:** ${data.wasteDetected.join(', ')}\n`;
        analysisText += "Please ensure proper segregation and disposal!\n\n";
      }

      analysisText += "💡 You can ask me questions about the items in this image or how to dispose of them properly!";

      return analysisText;
    } catch (error) {
      console.error('Vision API Error:', error);
      return "⚠️ Sorry, I couldn't analyze the image. The Vision API server might not be running.\n\nPlease make sure the server is running on port 5000.\nRun: `node server.js`";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgText = text || input.trim();
    const hasImage = !!selectedImage;

    if ((!msgText && !hasImage) || isLoading) return;

    const userMsg: Msg = {
      role: "user",
      content: hasImage ? (msgText || "📷 Analyze this image") : msgText,
      imageUrl: imagePreview || undefined
    };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");

    // Clear the image after sending
    const imageToAnalyze = selectedImage;
    clearImage();

    setIsLoading(true);

    // If there's an image, analyze it first
    if (hasImage && imageToAnalyze) {
      const analysisResult = await analyzeImageWithVision(imageToAnalyze);
      setMessages(prev => [...prev, { role: "assistant", content: analysisResult }]);
      setIsLoading(false);
      return;
    }

    const addAssistantMsg = (content: string, buttons?: string[]) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, buttons },
      ]);
    };

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      // Try Gemini API first
      if (apiKey) {
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

        const historyToSend: Msg[] = [];
        let expectedRole = "user";
        for (let i = allMsgs.length - 1; i >= 0; i--) {
          const msg = allMsgs[i];
          if (msg.role === "assistant") continue; // skip all assistant msgs for clean history
          const geminiRole = msg.role === "user" ? "user" : "model";
          if (geminiRole === expectedRole) {
            historyToSend.unshift(msg);
            expectedRole = expectedRole === "user" ? "model" : "user";
          }
        }

        const formattedMessages = historyToSend.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        const requestBody = {
          systemInstruction: {
            parts: [{
              text: "You are a helpful assistant for NAMMA MADURAI / Clean Madurai. You answer questions about nearest toilets, waste segregation, compost centers, e-waste disposal, plastic ban, water supply, and reporting complaints. Keep answers concise, helpful, and friendly. Speak natively like a Madurai local where appropriate. Use emojis to make the conversation lively."
            }]
          },
          contents: formattedMessages,
        };

        try {
          const resp = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          if (resp.ok && resp.body) {
            // Stream Gemini response
            let assistantSoFar = "";
            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const parts = buffer.split("\n\n");
              buffer = parts.pop() || "";

              for (const part of parts) {
                if (!part.trim()) continue;
                const dataString = part
                  .split("\n")
                  .filter((line) => line.startsWith("data: "))
                  .map((line) => line.replace(/^data:\s*/, ""))
                  .join("");
                if (!dataString || dataString === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(dataString);
                  const content = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (content) {
                    assistantSoFar += content;
                    setMessages((prev) => {
                      const last = prev[prev.length - 1];
                      if (last?.role === "assistant" && prev.length > allMsgs.length) {
                        return prev.map((m, i) =>
                          i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                        );
                      }
                      return [...prev.slice(0, allMsgs.length), { role: "assistant", content: assistantSoFar }];
                    });
                  }
                } catch (e) {
                  console.error("JSON Parse Error:", e);
                }
              }
            }

            setIsLoading(false);
            return; // Successfully used Gemini — done!
          }
        } catch (fetchErr) {
          console.warn("Gemini fetch failed, using offline mode.", fetchErr);
        }
      }

      // Fallback: Offline smart responses
      await new Promise((r) => setTimeout(r, 400));
      const response = getOfflineResponse(msgText);
      addAssistantMsg(response.text, response.buttons);
    } catch (e) {
      console.error(e);
      await new Promise((r) => setTimeout(r, 400));
      const response = getOfflineResponse(msgText);
      addAssistantMsg(response.text, response.buttons);
    }
    setIsLoading(false);
  };

  const handleButtonClick = (label: string) => {
    handleSend(label);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105"
        aria-label="Chat assistant"
      >
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-80 flex-col overflow-hidden rounded-xl border bg-[#f7f8f6] shadow-xl sm:w-96">
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            {/* Green orb top-left */}
            <div className="absolute -top-4 -left-4 h-40 w-40 rounded-full bg-gradient-to-br from-[#3d8a52] to-[#2a7040]/60 blur-xl" />
            {/* Golden orb bottom-right */}
            <div className="absolute -bottom-2 -right-2 h-36 w-36 rounded-full bg-gradient-to-tl from-[#a8842e] to-[#c9a84a]/50 blur-xl" />
            {/* Circuit lines top */}
            <svg className="absolute top-8 left-6 w-full opacity-60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 L40,30 L55,15 L100,15 L115,30 L160,30 L175,15 L220,15 L235,30 L300,30" stroke="#1a3320" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="55" cy="15" r="3" fill="#1a3320" />
              <circle cx="175" cy="15" r="3" fill="#1a3320" />
            </svg>
            {/* Circuit lines bottom */}
            <svg className="absolute bottom-12 right-2 w-3/4 opacity-60" viewBox="0 0 250 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,25 L30,25 L45,10 L90,10 L105,25 L150,25 L165,40 L250,40" stroke="#1a3320" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="105" cy="25" r="3" fill="#1a3320" />
            </svg>
            {/* Arrows decorative */}
            <svg className="absolute top-1/3 left-2 opacity-70" width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path d="M5 15 L15 5 M15 5 L15 12 M15 5 L8 5" stroke="#1a3320" strokeWidth="2.5" />
            </svg>
            <svg className="absolute bottom-1/3 right-4 opacity-70" width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path d="M5 15 L15 5 M15 5 L15 12 M15 5 L8 5" stroke="#1a3320" strokeWidth="2.5" />
            </svg>
            {/* Sparkle bottom-right */}
            <svg className="absolute bottom-10 right-6 opacity-70" width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#8a6a1e" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-2 border-b bg-primary px-4 py-3">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
            <span className="font-semibold text-primary-foreground">Clean Madurai Assistant</span>
          </div>

          <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/80 backdrop-blur-sm text-foreground border border-[#d8e4da]"
                      }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded"
                        className="max-w-full max-h-40 rounded-md mb-2 object-cover"
                      />
                    )}
                    {msg.content}
                  </div>
                </div>
                {/* Topic quick-reply buttons */}
                {msg.role === "assistant" && msg.buttons && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                    {msg.buttons.map((btn, j) => (
                      <button
                        key={j}
                        onClick={() => handleButtonClick(btn)}
                        disabled={isLoading}
                        className="rounded-full border border-primary/30 bg-white/70 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-50"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white/80 backdrop-blur-sm border border-[#d8e4da] px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 border-t bg-white/60 backdrop-blur-sm p-2">
            {/* Image preview */}
            {imagePreview && (
              <div className="relative mb-2 inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-20 rounded-md border"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
                >
                  ×
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                id="chat-image-upload"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Upload image for analysis"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={imagePreview ? "Add message (optional)..." : "Ask about waste, toilets..."}
                className="flex-1 text-sm bg-white/80"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || (!input.trim() && !selectedImage)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
