import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, MapPin, CheckCircle, Upload, Loader2, Sparkles, Target, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseReports, supabaseUserScores } from "@/lib/supabase";
import { motion } from "framer-motion";

// ── Design Tokens ──
const C = {
  bg: "#000000",
  card: "#101A18",
  cardBorder: "rgba(26,242,193,0.12)",
  cardGlow: "inset 0 1px 0 0 rgba(26,242,193,0.08), 0 0 30px -10px rgba(26,242,193,0.1)",
  teal: "#1AF2C1",
  lime: "#A2F21A",
  gold: "#F2C41A",
  orange: "#EA7B1A",
  red: "#F2441A",
  offWhite: "#E8F0ED",
  muted: "rgba(232,240,237,0.4)",
  secondary: "rgba(232,240,237,0.6)",
  inputBg: "rgba(26,242,193,0.03)",
  inputBorder: "rgba(26,242,193,0.15)",
};

const glassCard = "rounded-[16px] border backdrop-blur-sm";
const cardStyle = {
  background: `linear-gradient(145deg, ${C.card} 0%, rgba(10,18,14,0.95) 100%)`,
  borderColor: C.cardBorder,
  boxShadow: C.cardGlow,
};

const UserReportIssue = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [wasteType, setWasteType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setTimeout(() => {
          setAiSuggestion("Garbage Dump");
          setWasteType("garbage");
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Madurai)`);
        },
        () => {
          setCoordinates({ lat: 9.9252, lng: 78.1198 });
          setLocation("Vilakkuthoon Market, Madurai - 625002");
        }
      );
    } else {
      setCoordinates({ lat: 9.9252, lng: 78.1198 });
      setLocation("Vilakkuthoon Market, Madurai - 625002");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const typeMap: Record<string, "garbage" | "overflow" | "damage" | "other"> = {
        garbage: "garbage",
        overflow: "overflow",
        street: "garbage",
        hazardous: "other",
        ewaste: "other",
        construction: "damage",
      };

      const report = await supabaseReports.create({
        user_id: user.id,
        user_name: user.name,
        type: typeMap[wasteType] || "other",
        description: description || `${wasteType} issue - Severity: ${severity}`,
        latitude: coordinates?.lat || 9.9252,
        longitude: coordinates?.lng || 78.1198,
        address: location || null,
        status: "pending",
        image_url: photoPreview || null,
      });

      await supabaseUserScores.upsertScore(user.id, user.name, user.email, 10);

      setTicketId(`RPT-${report.id.slice(-6).toUpperCase()}`);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setPhotoPreview(null);
    setAiSuggestion(null);
    setLocation("");
    setCoordinates(null);
    setWasteType("");
    setSeverity("");
    setDescription("");
    setTicketId(null);
  };

  return (
    <div
      className="min-h-screen font-['Inter',sans-serif] relative overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* ── Background: Meenakshi Temple Image ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Temple background image */}
        <img
          src="/hero-sequence/frame_000_delay-0.04s.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(0,0,0,0.55) 0%,
                rgba(0,0,0,0.65) 30%,
                rgba(0,0,0,0.75) 60%,
                rgba(16,26,24,0.9) 100%
              )
            `,
          }}
        />
        {/* Teal glow accents */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(26,242,193,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(162,242,26,0.06) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        <div className="mx-auto max-w-2xl">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.offWhite }}>
              Report an Issue
            </h1>
            <p className="text-xs mt-1 font-medium italic" style={{ color: C.teal }}>
              Help keep Madurai clean by reporting civic issues in your area.
            </p>
          </motion.div>

          {/* ── Main Form Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={glassCard} style={cardStyle}>
              {/* Card Header */}
              <div
                className="px-6 py-4"
                style={{ borderBottom: `1px solid ${C.cardBorder}` }}
              >
                <h2 className="text-sm font-bold" style={{ color: C.offWhite }}>Issue Details</h2>
                <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>
                  Fill in the details below to submit your report. Our AI will help classify the waste type.
                </p>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* ── Photo Upload ── */}
                  <div>
                    <Label
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: C.muted }}
                    >
                      Upload Photo
                    </Label>
                    <div className="relative">
                      {photoPreview ? (
                        <div
                          className="relative overflow-hidden rounded-xl"
                          style={{ border: `1px solid ${C.cardBorder}` }}
                        >
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-48 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoPreview(null);
                              setAiSuggestion(null);
                            }}
                            className="absolute right-2 top-2 rounded-full p-1.5 text-white transition-colors backdrop-blur-md"
                            style={{ background: "rgba(0,0,0,0.6)" }}
                          >
                            ×
                          </button>
                          {aiSuggestion && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-md"
                              style={{
                                background: `${C.teal}20`,
                                color: C.teal,
                                border: `1px solid ${C.teal}40`,
                              }}
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              AI Detected: {aiSuggestion}
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <label
                          className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all hover:border-solid"
                          style={{
                            borderColor: C.inputBorder,
                            background: C.inputBg,
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                          <div
                            className="p-3 rounded-full mb-3"
                            style={{ background: `${C.teal}10`, border: `1px solid ${C.teal}20` }}
                          >
                            <Upload className="h-5 w-5" style={{ color: C.teal }} />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: C.offWhite }}>
                            Click to upload or drag photo here
                          </span>
                          <span className="mt-1 text-[10px] font-medium" style={{ color: C.muted }}>
                            AI will auto-detect waste type
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* ── Location ── */}
                  <div>
                    <Label
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: C.muted }}
                    >
                      Location
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Auto-detected location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 h-11 rounded-xl text-sm font-medium"
                        style={{
                          background: C.inputBg,
                          border: `1px solid ${C.inputBorder}`,
                          color: C.offWhite,
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 gap-2 h-11 px-4 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: `${C.teal}08`,
                          borderColor: C.inputBorder,
                          color: C.teal,
                        }}
                        onClick={handleDetectLocation}
                      >
                        <Target className="h-4 w-4" style={{ color: C.teal }} />
                        Detect
                      </Button>
                    </div>
                  </div>

                  {/* ── Waste Type + Severity ── */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: C.muted }}
                      >
                        Waste Type
                        {aiSuggestion && (
                          <span
                            className="ml-2 text-[9px] font-bold normal-case tracking-normal px-1.5 py-0.5 rounded"
                            style={{ background: `${C.teal}15`, color: C.teal }}
                          >
                            (AI: {aiSuggestion})
                          </span>
                        )}
                      </Label>
                      <Select value={wasteType} onValueChange={setWasteType}>
                        <SelectTrigger
                          className="h-11 rounded-xl text-sm font-medium"
                          style={{
                            background: C.inputBg,
                            border: `1px solid ${C.inputBorder}`,
                            color: wasteType ? C.offWhite : C.muted,
                          }}
                        >
                          <SelectValue placeholder="Select waste type" />
                        </SelectTrigger>
                        <SelectContent
                          className="rounded-xl shadow-xl"
                          style={{
                            background: C.card,
                            border: `1px solid ${C.cardBorder}`,
                            color: C.offWhite,
                          }}
                        >
                          <SelectItem value="garbage">Garbage Dump</SelectItem>
                          <SelectItem value="overflow">Overflowing Bin</SelectItem>
                          <SelectItem value="street">Street Waste</SelectItem>
                          <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                          <SelectItem value="ewaste">E-Waste</SelectItem>
                          <SelectItem value="construction">Construction Debris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]"
                        style={{ color: C.muted }}
                      >
                        Severity Level
                      </Label>
                      <Select value={severity} onValueChange={setSeverity}>
                        <SelectTrigger
                          className="h-11 rounded-xl text-sm font-medium"
                          style={{
                            background: C.inputBg,
                            border: `1px solid ${C.inputBorder}`,
                            color: severity ? C.offWhite : C.muted,
                          }}
                        >
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent
                          className="rounded-xl shadow-xl"
                          style={{
                            background: C.card,
                            border: `1px solid ${C.cardBorder}`,
                            color: C.offWhite,
                          }}
                        >
                          <SelectItem value="low">Low - Minor issue</SelectItem>
                          <SelectItem value="medium">Medium - Needs attention</SelectItem>
                          <SelectItem value="high">High - Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ── Additional Details ── */}
                  <div>
                    <Label
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: C.muted }}
                    >
                      Additional Details (Optional)
                    </Label>
                    <Textarea
                      placeholder="Describe the issue or add any relevant information..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="rounded-xl resize-none text-sm font-medium"
                      style={{
                        background: C.inputBg,
                        border: `1px solid ${C.inputBorder}`,
                        color: C.offWhite,
                      }}
                    />
                  </div>

                  {/* ── Submit Button ── */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      className="w-full gap-2 h-12 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${C.teal}, ${C.lime})`,
                        color: C.bg,
                        boxShadow: `0 4px 20px -4px ${C.teal}40`,
                      }}
                      disabled={isSubmitting || !wasteType || !severity}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent
          className="sm:max-w-md p-0 overflow-hidden border-none"
          style={{
            background: C.card,
            borderRadius: "20px",
            boxShadow: `0 0 60px -10px ${C.teal}30`,
          }}
        >
          {/* Success Header */}
          <div
            className="p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${C.teal}20, ${C.lime}10)`,
              borderBottom: `1px solid ${C.cardBorder}`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm"
              style={{
                background: `${C.teal}15`,
                border: `2px solid ${C.teal}40`,
              }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: C.teal }} />
            </motion.div>
            <DialogTitle
              className="text-center text-xl font-bold"
              style={{ color: C.offWhite }}
            >
              Report Submitted Successfully
            </DialogTitle>
            <DialogDescription
              className="text-center mt-2 text-sm"
              style={{ color: C.secondary }}
            >
              Your report has been successfully submitted. Together, we're building a cleaner Madurai.
            </DialogDescription>
          </div>

          {/* Details */}
          <div className="p-6">
            <div
              className="space-y-3 rounded-xl p-4 text-sm mb-5"
              style={{
                background: "rgba(26,242,193,0.03)",
                border: `1px solid ${C.cardBorder}`,
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: C.muted }}>Ticket ID</span>
                <span
                  className="font-mono font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: `${C.teal}10`,
                    color: C.teal,
                    border: `1px solid ${C.teal}25`,
                  }}
                >
                  {ticketId}
                </span>
              </div>
              <div className="w-full" style={{ height: "1px", background: C.cardBorder }} />
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: C.muted }}>Estimated Resolution</span>
                <span className="font-bold" style={{ color: C.offWhite }}>24–48 hours</span>
              </div>
              <div className="w-full" style={{ height: "1px", background: C.cardBorder }} />
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: C.muted }}>Status</span>
                <span
                  className="font-bold text-xs px-2.5 py-1 rounded-md"
                  style={{
                    background: `${C.gold}12`,
                    color: C.gold,
                    border: `1px solid ${C.gold}25`,
                  }}
                >
                  Pending Assignment
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl text-sm font-semibold"
                style={{
                  background: "transparent",
                  borderColor: C.cardBorder,
                  color: C.secondary,
                }}
                onClick={resetForm}
              >
                Submit Another
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${C.teal}, ${C.lime})`,
                  color: C.bg,
                }}
                onClick={() => setSubmitted(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReportIssue;
