import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2, AlertTriangle, Thermometer, Star, Navigation, Loader2, X } from "lucide-react";
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

const fillColor: Record<string, string> = { Low: "bg-emerald-500", Medium: "bg-amber-500", Full: "bg-rose-500", default: "bg-gray-400" };
const severityColor: Record<string, string> = { pending: "bg-amber-100 text-amber-700", "in-progress": "bg-blue-100 text-blue-700", resolved: "bg-gray-100 text-gray-700" };

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
      <aside className="w-full shrink-0 overflow-y-auto border-b border-gray-200 bg-white p-6 lg:w-[340px] lg:border-b-0 lg:border-r shadow-sm z-10 flex flex-col">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Civic Filters</h2>

        <Accordion type="multiple" defaultValue={["toilets", "bins", "hotspots"]} className="space-y-3 flex-1">
          {/* TOILETS SECTION */}
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
                    className="cursor-pointer p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 border-gray-100 shadow-none rounded-xl"
                    onClick={() => {
                      setSelectedMarker({ type: "toilet", data: t });
                      if (t.lat && t.lng) setMapCenter([t.lat, t.lng]);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                      <Badge variant={t.open ? "default" : "secondary"} className={`text-[10px] px-2 py-0 h-5 font-medium border-none ${t.open ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
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

          {/* BINS SECTION */}
          <AccordionItem value="bins" className="border-none">
            <AccordionTrigger className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <Trash2 className="h-4 w-4 text-blue-600" />
                </div>
                Garbage Bins ({bins.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-3 pb-1">
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : bins.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">No bins found</p>
                ) : (
                  bins.map((b) => (
                    <Card
                      key={b.id}
                      className="cursor-pointer p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 border-gray-100 shadow-none rounded-xl"
                      onClick={() => {
                        setSelectedMarker({ type: "bin", data: b });
                        setMapCenter([b.latitude, b.longitude]);
                      }}
                    >
                      <p className="text-sm font-medium text-gray-800">{b.area}</p>
                      <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill_level] || fillColor.default}`} />
                          <span>{b.fill_level}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-blue-200 text-blue-700 bg-blue-50 px-1.5 py-0 h-5">Live</Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* REPORTS SECTION */}
          <AccordionItem value="hotspots" className="border-none">
            <AccordionTrigger className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                Active Reports ({reports.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-3 pb-1">
              <div className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">No active reports</p>
                ) : (
                  reports.map((r) => (
                    <Card
                      key={r.id}
                      className="cursor-pointer p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50 border-gray-100 shadow-none rounded-xl"
                      onClick={() => {
                        setSelectedMarker({ type: "report", data: r });
                        setMapCenter([r.latitude, r.longitude]);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium capitalize text-gray-800">{r.type}</p>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${severityColor[r.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {r.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 font-medium">By {r.user_name}</p>
                    </Card>
                  ))
                )}
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
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium">
              <AlertTriangle className="mr-1.5 h-3 w-3" /> Reports
            </Badge>
          </div>
        </div>
      </aside>

      {/* Map Area */}
      <main className="relative flex-1 min-h-[400px]">
        {loading ? (
          <div className="flex h-full items-center justify-center bg-gray-100/50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <MapContainer
            center={mapCenter || [9.9252, 78.1198]}
            zoom={14}
            className={`h-full w-full z-0 transition-all ${heatmap ? 'brightness-90 contrast-125 sepia-[.2]' : ''}`}
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
                <Popup className="rounded-xl overflow-hidden shadow-lg border-none">
                  <div className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2">{t.name}</div>
                  <div className="text-sm text-gray-600 mb-1">Rating: {t.rating} <Star className="inline w-3 h-3 text-amber-500 fill-amber-500" /></div>
                  <div className="text-sm font-medium text-emerald-600">{t.open ? "Open" : "Closed"}</div>
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
                <Popup className="rounded-xl overflow-hidden shadow-lg border-none">
                  <div className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2">{b.area}</div>
                  <div className="text-sm font-medium text-blue-600 flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill_level] || fillColor.default}`} />
                    Fill: {b.fill_level}
                  </div>
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
                <Popup className="rounded-xl overflow-hidden shadow-lg border-none">
                  <div className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-2 capitalize">{r.type}</div>
                  <div className={`text-sm font-semibold capitalize mb-1 ${r.status === 'resolved' ? 'text-gray-500' : 'text-amber-600'}`}>Status: {r.status.replace("-", " ")}</div>
                  <div className="text-xs text-gray-500">By: {r.user_name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Selected Marker Details Overlay */}
        {selectedMarker && (
          <div className="absolute bottom-8 left-1/2 w-[340px] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md p-5 shadow-2xl z-[1000]">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedMarker.type === "toilet" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                  selectedMarker.type === "bin" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                    "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                  {selectedMarker.type === "toilet" && <MapPin className="h-5 w-5" />}
                  {selectedMarker.type === "bin" && <Trash2 className="h-5 w-5" />}
                  {selectedMarker.type === "report" && <AlertTriangle className="h-5 w-5" />}
                </div>
                <h4 className="font-bold text-gray-900 capitalize text-lg tracking-tight">
                  {selectedMarker.type === "toilet" && selectedMarker.data.name}
                  {selectedMarker.type === "bin" && selectedMarker.data.area}
                  {selectedMarker.type === "report" && selectedMarker.data.type}
                </h4>
              </div>
              <button
                className="text-gray-400 hover:text-gray-900 transition-colors bg-white hover:bg-gray-100 border border-gray-100 shadow-sm p-1.5 rounded-full"
                onClick={() => setSelectedMarker(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-600 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              {/* Toilet details */}
              {selectedMarker.type === "toilet" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rating</span>
                    <span className="flex items-center gap-1 font-semibold text-gray-900">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      {selectedMarker.data.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Distance</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5 text-gray-400" /> {selectedMarker.data.distance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Cleanliness</span>
                    <span className="font-semibold text-emerald-600">{selectedMarker.data.cleanliness}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Status</span>
                    <Badge variant={selectedMarker.data.open ? "default" : "secondary"} className={`text-[10px] px-2 py-0 border-none ${selectedMarker.data.open ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                      {selectedMarker.data.open ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </>
              )}
              {/* Bin details */}
              {selectedMarker.type === "bin" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Fill Level</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${fillColor[selectedMarker.data.fill_level] || fillColor.default}`} />
                      <span className="font-bold text-gray-900">{selectedMarker.data.fill_level}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Area</span>
                    <span className="font-semibold text-gray-900">{selectedMarker.data.area}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Lat / Lng</span>
                    <span className="font-semibold text-gray-900">{selectedMarker.data.latitude.toFixed(4)}, {selectedMarker.data.longitude.toFixed(4)}</span>
                  </div>
                  {selectedMarker.data.last_collected && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500">Last Collected</span>
                      <span className="font-semibold text-gray-900">{new Date(selectedMarker.data.last_collected).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
              {/* Report details */}
              {selectedMarker.type === "report" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Type</span>
                    <span className="font-bold text-gray-900 capitalize">{selectedMarker.data.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Status</span>
                    <span className={`font-semibold capitalize ${severityColor[selectedMarker.data.status] || 'text-gray-900'}`}>
                      {selectedMarker.data.status?.replace("-", " ") || selectedMarker.data.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Lat / Lng</span>
                    <span className="font-semibold text-gray-900">{selectedMarker.data.latitude?.toFixed(4) || 0}, {selectedMarker.data.longitude?.toFixed(4) || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Reported by</span>
                    <span className="font-semibold text-gray-900">{selectedMarker.data.user_name}</span>
                  </div>
                  {selectedMarker.data.description && (
                    <div className="pt-2 mt-2 border-t border-gray-200/50">
                      <p className="text-xs text-gray-600 italic">"{selectedMarker.data.description}"</p>
                    </div>
                  )}
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
