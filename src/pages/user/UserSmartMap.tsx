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

<<<<<<< HEAD
const fillColor: Record<string, string> = { Low: "bg-emerald-500", Medium: "bg-amber-500", Full: "bg-rose-500" };
const severityColor: Record<string, string> = { Low: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700", High: "bg-rose-100 text-rose-700" };
=======
const fillColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", Full: "bg-destructive" };
const severityColor: Record<string, string> = { pending: "bg-accent", "in-progress": "bg-primary", resolved: "bg-muted" };
const typeToSeverity: Record<string, string> = { garbage: "High", overflow: "High", damage: "Medium", other: "Low" };
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976

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
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-[#f3f4f6]">
      {/* Left Panel - Filters */}
      <aside className="w-full shrink-0 overflow-y-auto border-b border-gray-200 bg-white p-6 lg:w-[340px] lg:border-b-0 lg:border-r shadow-sm z-10">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Civic Filters</h2>

        <Accordion type="multiple" defaultValue={["toilets"]} className="space-y-3">
          <AccordionItem value="toilets" className="border-none">
            <AccordionTrigger className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                Public Toilets
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-3 pb-1">
              <div className="space-y-2">
                {mockToilets.map((t) => (
                  <Card
                    key={t.id}
<<<<<<< HEAD
                    className="cursor-pointer p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 border-gray-100 shadow-none rounded-xl"
                    onClick={() => setSelectedMarker({ type: "toilet", data: t })}
=======
                    className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                    onClick={() => {
                      setSelectedMarker({ type: "toilet", data: t });
                      setMapCenter([t.lat, t.lng]);
                    }}
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <Badge variant={t.open ? "default" : "secondary"} className={`text-[10px] px-2 py-0 h-5 font-medium border-none ${t.open ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                        {t.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {t.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {t.distance}
                      </span>
                      <span className="text-emerald-600">{t.cleanliness}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bins" className="border-none">
<<<<<<< HEAD
            <AccordionTrigger className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <Trash2 className="h-4 w-4 text-blue-600" />
                </div>
                Garbage Bins
=======
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-primary" /> Garbage Bins ({bins.length})
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-3 pb-1">
              <div className="space-y-2">
<<<<<<< HEAD
                {mockBins.map((b) => (
                  <Card
                    key={b.id}
                    className="cursor-pointer p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 border-gray-100 shadow-none rounded-xl"
                    onClick={() => setSelectedMarker({ type: "bin", data: b })}
                  >
                    <p className="text-sm font-semibold text-gray-800">{b.name}</p>
                    <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill]}`} />
                        <span>{b.fill}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {b.distance}
                      </span>
                      {b.smart && (
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-blue-200 text-blue-700 bg-blue-50 px-1.5 py-0 h-5">
                          IoT
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
=======
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
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotspots" className="border-none">
<<<<<<< HEAD
            <AccordionTrigger className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                Waste Hotspots
=======
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" /> Active Reports ({reports.length})
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-3 pb-1">
              <div className="space-y-2">
<<<<<<< HEAD
                {mockHotspots.map((h) => (
                  <Card
                    key={h.id}
                    className="cursor-pointer p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50 border-gray-100 shadow-none rounded-xl"
                    onClick={() => setSelectedMarker({ type: "hotspot", data: h })}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-gray-800">{h.name}</p>
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityColor[h.severity]}`}
                      >
                        {h.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-medium">{h.reports} active reports</p>
                  </Card>
                ))}
=======
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
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Heatmap Toggle */}
        <div className="mt-6 mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Thermometer className="h-4 w-4 text-rose-500" /> Heatmap View
          </span>
          <Switch checked={heatmap} onCheckedChange={setHeatmap} />
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Legend</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-medium">
              <MapPin className="mr-1.5 h-3 w-3" /> Toilets
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-medium">
              <Trash2 className="mr-1.5 h-3 w-3" /> Bins
            </Badge>
<<<<<<< HEAD
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium">
              <AlertTriangle className="mr-1.5 h-3 w-3" /> Hotspots
=======
            <Badge variant="outline">
              <AlertTriangle className="mr-1 h-3 w-3" /> Reports
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
            </Badge>
          </div>
        </div>
      </aside>

      {/* Map Area */}
<<<<<<< HEAD
      <main className="relative flex flex-1 items-center justify-center bg-gray-200">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Placeholder for Google Maps */}
        <div className="flex flex-col items-center gap-4 p-8 text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl z-0 max-w-sm mx-4 border border-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 shadow-inner border border-emerald-100">
            <MapPin className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Google Maps Frame</h3>
          <p className="max-w-md text-sm text-gray-500 leading-relaxed font-medium">
            Interactive map displays here with civic markers.
            {heatmap && <span className="block mt-1 text-rose-600">Heatmap overlay active.</span>}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-gray-600 bg-white shadow-sm border-gray-200">4 Toilets</Badge>
            <Badge variant="outline" className="text-gray-600 bg-white shadow-sm border-gray-200">4 Bins</Badge>
            <Badge variant="outline" className="text-gray-600 bg-white shadow-sm border-gray-200">3 Hotspots</Badge>
          </div>
        </div>

        {/* Selected Marker Popup */}
        {selectedMarker && (
          <div className="absolute bottom-8 left-1/2 w-80 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl z-20">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedMarker.type === "toilet" ? "bg-emerald-50 text-emerald-600" :
                    selectedMarker.type === "bin" ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                  }`}>
                  {selectedMarker.type === "toilet" && <MapPin className="h-5 w-5" />}
                  {selectedMarker.type === "bin" && <Trash2 className="h-5 w-5" />}
                  {selectedMarker.type === "hotspot" && <AlertTriangle className="h-5 w-5" />}
                </div>
                <h4 className="font-semibold text-gray-900">{selectedMarker.data.name}</h4>
=======
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
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedMarker(null)}
              >
                ×
              </button>
            </div>
<<<<<<< HEAD

            <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {"rating" in selectedMarker.data && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Rating</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-900">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    {selectedMarker.data.rating}
                  </span>
                </div>
              )}
              {"distance" in selectedMarker.data && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Distance</span>
                  <span className="font-semibold text-gray-900">{selectedMarker.data.distance}</span>
                </div>
              )}
              {"cleanliness" in selectedMarker.data && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cleanliness</span>
                  <span className="font-semibold text-emerald-600">{selectedMarker.data.cleanliness}</span>
                </div>
              )}
              {"fill" in selectedMarker.data && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Fill Level</span>
                  <span className="font-semibold text-gray-900">{selectedMarker.data.fill}</span>
                </div>
              )}
              {"severity" in selectedMarker.data && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Severity</span>
                  <span className={`font-semibold ${selectedMarker.data.severity === 'High' ? 'text-rose-600' : selectedMarker.data.severity === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {selectedMarker.data.severity}
                  </span>
                </div>
=======
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
>>>>>>> 83a39f63a6159bcafedbd4b2ccce80b8f95d6976
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserSmartMap;
