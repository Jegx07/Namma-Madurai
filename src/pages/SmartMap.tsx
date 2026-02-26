import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Trash2, AlertTriangle, Thermometer, Star } from "lucide-react";
import { mockToilets, mockBins, mockHotspots } from "@/data/mockData";

const fillColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", Full: "bg-destructive" };
const severityColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", High: "bg-destructive" };

const SmartMap = () => {
  const [heatmap, setHeatmap] = useState(false);

  return (
    <div className="flex flex-1 flex-col md:flex-row" style={{ minHeight: "calc(100vh - 4rem)" }}>
      {/* Left Panel */}
      <aside className="w-full overflow-y-auto border-r bg-background p-4 md:w-[30%] lg:w-[28%]">
        <h2 className="mb-4 text-lg font-bold text-foreground">Civic Filters</h2>

        <Accordion type="multiple" defaultValue={["toilets"]} className="space-y-1">
          <AccordionItem value="toilets">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Public Toilets</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {mockToilets.map((t) => (
                  <div key={t.id} className="rounded-lg border bg-card p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{t.name}</p>
                      <Badge variant={t.open ? "default" : "secondary"} className="text-xs">
                        {t.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-accent" />{t.rating}</span>
                      <span>{t.distance}</span>
                      <span>{t.gender}</span>
                      <span>{t.cleanliness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bins">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-primary" /> Garbage Bins</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {mockBins.map((b) => (
                  <div key={b.id} className="rounded-lg border bg-card p-3">
                    <p className="text-sm font-medium">{b.name}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill]}`} />
                      <span>{b.fill}</span>
                      {b.smart && <Badge variant="outline" className="text-xs">IoT</Badge>}
                      <span>{b.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotspots">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-accent" /> Waste Hotspots</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {mockHotspots.map((h) => (
                  <div key={h.id} className="rounded-lg border bg-card p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{h.name}</p>
                      <span className={`inline-block rounded px-2 py-0.5 text-xs text-primary-foreground ${severityColor[h.severity]}`}>
                        {h.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{h.reports} reports</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 flex items-center justify-between rounded-lg border bg-card p-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Thermometer className="h-4 w-4 text-primary" /> Heatmap
          </span>
          <Switch checked={heatmap} onCheckedChange={setHeatmap} />
        </div>
      </aside>

      {/* Map Area */}
      <main className="relative flex flex-1 items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-3 text-center p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Google Maps Integration</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Map will render here once a Google Maps API key is configured. Markers, clustering, and {heatmap ? "heatmap overlay" : "standard view"} are ready.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>4 Toilets</Badge>
            <Badge variant="secondary">4 Bins</Badge>
            <Badge variant="outline">3 Hotspots</Badge>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartMap;
