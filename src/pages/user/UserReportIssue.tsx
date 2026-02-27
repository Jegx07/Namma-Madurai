import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, MapPin, CheckCircle, Upload, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseReports, supabaseUserScores } from "@/lib/supabase";

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
        // Simulate AI detection
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
          // Fallback to default Madurai location
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
      // Map waste type to report type
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

      // Award points to user for submitting report
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
    <div className="p-6 lg:p-8 bg-[#f3f4f6] min-h-screen text-slate-800 font-sans">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Report an Issue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Help keep Madurai clean by reporting civic issues in your area.
          </p>
        </div>

        <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-white p-6">
            <CardTitle className="text-base font-semibold text-gray-900">Issue Details</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Fill in the details below to submit your report. Our AI will help classify the waste type.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div>
                <Label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Photo</Label>
                <div className="relative">
                  {photoPreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-gray-200">
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
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                      >
                        ×
                      </button>
                      {aiSuggestion && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI Detected: {aiSuggestion}
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:bg-gray-100 hover:border-emerald-300">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload or drag photo here
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        AI will auto-detect waste type
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">Location</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Auto-detected location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500 rounded-xl h-11"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 gap-2 h-11 px-4 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={handleDetectLocation}
                  >
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Detect
                  </Button>
                </div>
              </div>

              {/* Waste Type */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waste Type
                    {aiSuggestion && (
                      <span className="ml-2 text-[10px] font-medium text-emerald-600 normal-case tracking-normal bg-emerald-50 px-1.5 py-0.5 rounded">
                        (AI suggested: {aiSuggestion})
                      </span>
                    )}
                  </Label>
                  <Select value={wasteType} onValueChange={setWasteType}>
                    <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:ring-emerald-500 rounded-xl h-11">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                      <SelectItem value="garbage">Garbage Dump</SelectItem>
                      <SelectItem value="overflow">Overflowing Bin</SelectItem>
                      <SelectItem value="street">Street Waste</SelectItem>
                      <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                      <SelectItem value="ewaste">E-Waste</SelectItem>
                      <SelectItem value="construction">Construction Debris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div>
                  <Label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">Severity Level</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:ring-emerald-500 rounded-xl h-11">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                      <SelectItem value="low">Low - Minor issue</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <Label className="mb-2 block text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Details (Optional)</Label>
                <Textarea
                  placeholder="Describe the issue or add any relevant information..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500 rounded-xl resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gap-2 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                disabled={isSubmitting || !wasteType || !severity}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-xl p-0 overflow-hidden">
          <div className="bg-emerald-600 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-xl text-white font-semibold">Report Submitted Successfully</DialogTitle>
            <DialogDescription className="text-center text-emerald-100 mt-2">
              Your report has been successfully submitted. Together, we're building a cleaner Madurai.
            </DialogDescription>
          </div>
          <div className="p-6 bg-white">
            <div className="space-y-4 rounded-xl bg-gray-50 p-5 text-sm border border-gray-100 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Ticket ID</span>
                <span className="font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{ticketId}</span>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Estimated Resolution</span>
                <span className="font-semibold text-gray-900">24–48 hours</span>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Pending Assignment</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl h-11 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium" onClick={resetForm}>
                Submit Another
              </Button>
              <Button className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium" onClick={() => setSubmitted(false)}>
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
