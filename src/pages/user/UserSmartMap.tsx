import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2, AlertTriangle, Thermometer, Star, Navigation, Loader2 } from "lucide-react";
import { mockToilets } from "@/data/mockData";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabaseBins, supabaseReports } from "@/lib/supabase";

// Custom marker icons
const toiletIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const binIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hotspotIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Bin {
  id: string;
  latitude: number;
  longitude: number;
  fill_level: string;
  area: string;
  last_collected: string | null;
}

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  type: string;
  status: string;
  description: string;
  user_name: string;
  created_at: string;
}

// Component to handle map centering
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
};

const fillColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", Full: "bg-destructive" };
const severityColor: Record<string, string> = { pending: "bg-accent", "in-progress": "bg-primary", resolved: "bg-muted" };
const typeToSeverity: Record<string, string> = { garbage: "High", overflow: "High", damage: "Medium", other: "Low" };

const UserSmartMap = () => {
  const [heatmap, setHeatmap] = useState(false);
  const [bins, setBins] = useState<Bin[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{
    type: string;
    data: any;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [binsData, reportsData] = await Promise.all([
          supabaseBins.getAll(),
          supabaseReports.getAll(),
        ]);
        setBins(binsData || []);
        setReports(reportsData?.filter(r => r.status !== "resolved") || []);
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time bin updates
    const binsSub = supabaseBins.subscribeToChanges(() => {
      supabaseBins.getAll().then(data => setBins(data || []));
    });

    // Subscribe to real-time report updates
    const reportsSub = supabaseReports.subscribeToChanges(() => {
      supabaseReports.getAll().then(data => setReports(data?.filter(r => r.status !== "resolved") || []));
    });

    return () => {
      binsSub.unsubscribe();
      reportsSub.unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left Panel - Filters */}
      <aside className="w-full shrink-0 overflow-y-auto border-b bg-background p-4 lg:w-80 lg:border-b-0 lg:border-r">
        <h2 className="mb-4 text-lg font-bold text-foreground">Civic Filters</h2>

        <Accordion type="multiple" defaultValue={["toilets"]} className="space-y-1">
          <AccordionItem value="toilets" className="border-none">
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Public Toilets
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-2">
              <div className="space-y-2">
                {mockToilets.map((t) => (
                  <Card
                    key={t.id}
                    className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                    onClick={() => {
                      setSelectedMarker({ type: "toilet", data: t });
                      setMapCenter([t.lat, t.lng]);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{t.name}</p>
                      <Badge variant={t.open ? "default" : "secondary"} className="text-xs">
                        {t.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent" />
                        {t.rating}
                      </span>
                      <span>{t.distance}</span>
                      <span>{t.cleanliness}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bins" className="border-none">
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-primary" /> Garbage Bins ({bins.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-2">
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : bins.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No bins found</p>
                ) : (
                  bins.map((b) => (
                    <Card
                      key={b.id}
                      className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                      onClick={() => {
                        setSelectedMarker({ type: "bin", data: b });
                        setMapCenter([b.latitude, b.longitude]);
                      }}
                    >
                      <p className="text-sm font-medium">{b.area}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill_level] || "bg-muted"}`} />
                        <span>{b.fill_level}</span>
                        <Badge variant="outline" className="text-xs">Live</Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotspots" className="border-none">
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" /> Active Reports ({reports.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-2">
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No active reports</p>
                ) : (
                  reports.map((r) => (
                    <Card
                      key={r.id}
                      className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                      onClick={() => {
                        setSelectedMarker({ type: "report", data: r });
                        setMapCenter([r.latitude, r.longitude]);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium capitalize">{r.type}</p>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs text-primary-foreground capitalize ${severityColor[r.status]}`}
                        >
                          {r.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">By {r.user_name}</p>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Heatmap Toggle */}
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-card p-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Thermometer className="h-4 w-4 text-primary" /> Heatmap View
          </span>
          <Switch checked={heatmap} onCheckedChange={setHeatmap} />
        </div>

        {/* Legend */}
        <div className="mt-4 rounded-lg border bg-card p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Legend</p>
          <div className="flex flex-wrap gap-2">
            <Badge>
              <MapPin className="mr-1 h-3 w-3" /> Toilets
            </Badge>
            <Badge variant="secondary">
              <Trash2 className="mr-1 h-3 w-3" /> Bins
            </Badge>
            <Badge variant="outline">
              <AlertTriangle className="mr-1 h-3 w-3" /> Reports
            </Badge>
          </div>
        </div>
      </aside>

      {/* Map Area */}
      <main className="relative flex-1 min-h-0">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MapContainer
            center={[9.9252, 78.1198]}
            zoom={14}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter} />

            {/* Toilet markers */}
            {mockToilets.map((t) => (
              <Marker
                key={`toilet-${t.id}`}
                position={[t.lat, t.lng]}
                icon={toiletIcon}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: "toilet", data: t }),
                }}
              >
                <Popup>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm">Rating: {t.rating} ⭐</div>
                  <div className="text-sm">{t.open ? "Open" : "Closed"}</div>
                </Popup>
              </Marker>
            ))}

            {/* Bin markers */}
            {bins.map((b) => (
              <Marker
                key={`bin-${b.id}`}
                position={[b.latitude, b.longitude]}
                icon={binIcon}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: "bin", data: b }),
                }}
              >
                <Popup>
                  <div className="font-medium">{b.area}</div>
                  <div className="text-sm">Fill: {b.fill_level}</div>
                </Popup>
              </Marker>
            ))}

            {/* Report markers */}
            {reports.map((r) => (
              <Marker
                key={`report-${r.id}`}
                position={[r.latitude, r.longitude]}
                icon={hotspotIcon}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: "report", data: r }),
                }}
              >
                <Popup>
                  <div className="font-medium capitalize">{r.type}</div>
                  <div className="text-sm capitalize">Status: {r.status.replace("-", " ")}</div>
                  <div className="text-sm">By: {r.user_name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Selected Marker Popup */}
        {selectedMarker && (
          <div className="absolute bottom-6 left-1/2 w-80 -translate-x-1/2 rounded-xl border bg-card p-4 shadow-lg z-[1000]">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {selectedMarker.type === "toilet" && <MapPin className="h-5 w-5 text-primary" />}
                {selectedMarker.type === "bin" && <Trash2 className="h-5 w-5 text-primary" />}
                {selectedMarker.type === "report" && <AlertTriangle className="h-5 w-5 text-accent" />}
                <h4 className="font-semibold capitalize">
                  {selectedMarker.type === "toilet" && selectedMarker.data.name}
                  {selectedMarker.type === "bin" && selectedMarker.data.area}
                  {selectedMarker.type === "report" && selectedMarker.data.type}
                </h4>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedMarker(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {/* Toilet details */}
              {selectedMarker.type === "toilet" && (
                <>
                  <p className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent" />
                    Rating: {selectedMarker.data.rating}
                  </p>
                  <p className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    Distance: {selectedMarker.data.distance}
                  </p>
                  <p>Cleanliness: {selectedMarker.data.cleanliness}</p>
                  <p>Status: {selectedMarker.data.open ? "Open" : "Closed"}</p>
                </>
              )}
              {/* Bin details */}
              {selectedMarker.type === "bin" && (
                <>
                  <p>Fill Level: {selectedMarker.data.fill_level}</p>
                  <p>Area: {selectedMarker.data.area}</p>
                  {selectedMarker.data.last_collected && (
                    <p>Last Collected: {new Date(selectedMarker.data.last_collected).toLocaleDateString()}</p>
                  )}
                </>
              )}
              {/* Report details */}
              {selectedMarker.type === "report" && (
                <>
                  <p className="capitalize">Type: {selectedMarker.data.type}</p>
                  <p className="capitalize">Status: {selectedMarker.data.status.replace("-", " ")}</p>
                  <p>Reported by: {selectedMarker.data.user_name}</p>
                  {selectedMarker.data.description && <p>{selectedMarker.data.description}</p>}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserSmartMap;
