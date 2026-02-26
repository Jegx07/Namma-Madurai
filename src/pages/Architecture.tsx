import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Cloud, Cpu, MapPin, FileText, Brain, Shield, BarChart3 } from "lucide-react";

const flowSteps = [
  [
    { icon: Cpu, label: "IoT Smart Bins", desc: "Sensors detect fill levels" },
    { icon: Cloud, label: "Google Cloud", desc: "Data processing & storage" },
    { icon: BarChart3, label: "Dashboard", desc: "Real-time analytics" },
  ],
  [
    { icon: MapPin, label: "Citizen Report", desc: "Photo + location submitted" },
    { icon: Brain, label: "AI Detection", desc: "Vision API classifies waste" },
    { icon: Shield, label: "Admin Review", desc: "Assign & resolve issues" },
  ],
];

const techStack = [
  "Google Maps API",
  "Firebase Auth",
  "Cloud Firestore",
  "Cloud Functions",
  "Google Vision AI",
  "Vertex AI",
  "BigQuery Analytics",
];

const Architecture = () => {
  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">System Architecture</h1>
      <p className="mb-10 text-muted-foreground">How Namma Madurai processes civic intelligence.</p>

      <div className="space-y-10">
        {flowSteps.map((flow, fi) => (
          <div key={fi}>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              {fi === 0 ? "IoT → Cloud → Dashboard Flow" : "Citizen → AI → Resolution Flow"}
            </h2>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {flow.map((step, si) => (
                <div key={si} className="flex items-center gap-4">
                  <Card className="w-56 transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-center pt-6 text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <step.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{step.label}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {si < flow.length - 1 && (
                    <ArrowRight className="hidden h-6 w-6 text-accent sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <Card className="mt-12">
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Google Cloud Integration</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <span key={t} className="rounded-full border bg-muted px-4 py-1.5 text-sm font-medium text-foreground">
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Architecture;
