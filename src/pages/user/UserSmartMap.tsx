import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2, AlertTriangle, Thermometer, Star, Navigation, Hand, Crosshair } from "lucide-react";
import { mockToilets, mockBins, mockHotspots } from "@/data/mockData";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { createPortal } from "react-dom";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icons for different marker types
const toiletIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const binIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hotspotIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Heatmap layer component
const HeatmapLayer = ({ points, enabled }: { points: [number, number, number][]; enabled: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    // @ts-expect-error leaflet.heat types not available
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1: "red" },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points, enabled]);

  return null;
};

// Map center component for flying to selected marker
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 0.5 });
    }
  }, [map, center]);

  return null;
};

// Custom Pan Control Component
const PanControl = () => {
  const map = useMap();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isPanActive, setIsPanActive] = useState(true);

  useEffect(() => {
    // Find the zoom control container and create our custom control below it
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    if (zoomControl && zoomControl.parentElement) {
      const customControl = document.createElement('div');
      customControl.className = 'leaflet-control leaflet-bar custom-pan-control';
      customControl.style.marginTop = '10px';
      zoomControl.parentElement.appendChild(customControl);
      setContainer(customControl);

      return () => {
        customControl.remove();
      };
    }
  }, []);

  const handlePanMode = () => {
    if (isPanActive) {
      map.dragging.disable();
      map.getContainer().style.cursor = 'default';
      setIsPanActive(false);
    } else {
      map.dragging.enable();
      map.getContainer().style.cursor = 'grab';
      setIsPanActive(true);
    }
  };

  const handleRecenter = () => {
    map.flyTo([9.9195, 78.1193], 14, { duration: 0.5 });
  };

  if (!container) return null;

  return createPortal(
    <>
      <button
        onClick={handlePanMode}
        className="leaflet-custom-button"
        title={isPanActive ? "Disable Pan Mode" : "Enable Pan Mode - Drag to move map"}
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isPanActive ? '#e8f5e9' : 'white',
          border: 'none',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Hand size={20} color={isPanActive ? '#2e7d32' : '#333'} />
      </button>
      <button
        onClick={handleRecenter}
        className="leaflet-custom-button"
        title="Recenter Map"
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <Crosshair size={20} color="#333" />
      </button>
    </>,
    container
  );
};

const fillColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", Full: "bg-destructive" };
const severityColor: Record<string, string> = { Low: "bg-primary", Medium: "bg-accent", High: "bg-destructive" };

const UserSmartMap = () => {
  const [heatmap, setHeatmap] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<{
    type: string;
    data: typeof mockToilets[0] | typeof mockBins[0] | typeof mockHotspots[0];
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Madurai center coordinates
  const maduraiCenter: [number, number] = [9.9195, 78.1193];

  // Heatmap data from hotspots
  const heatmapData: [number, number, number][] = mockHotspots.map((h) => [
    h.lat,
    h.lng,
    h.severity === "High" ? 1 : h.severity === "Medium" ? 0.6 : 0.3,
  ]);

  const handleMarkerSelect = (
    type: string,
    data: typeof mockToilets[0] | typeof mockBins[0] | typeof mockHotspots[0]
  ) => {
    setSelectedMarker({ type, data });
    setMapCenter([data.lat, data.lng]);
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Filters */}
      <aside className="w-full shrink-0 overflow-y-auto border-b bg-background p-4 lg:w-80 lg:border-b-0 lg:border-r lg:h-full max-h-[30vh] lg:max-h-full">
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
                    onClick={() => handleMarkerSelect("toilet", t)}
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
                <Trash2 className="h-4 w-4 text-primary" /> Garbage Bins
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-2">
              <div className="space-y-2">
                {mockBins.map((b) => (
                  <Card
                    key={b.id}
                    className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                    onClick={() => handleMarkerSelect("bin", b)}
                  >
                    <p className="text-sm font-medium">{b.name}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`inline-block h-2 w-2 rounded-full ${fillColor[b.fill]}`} />
                      <span>{b.fill}</span>
                      {b.smart && (
                        <Badge variant="outline" className="text-xs">
                          IoT
                        </Badge>
                      )}
                      <span>{b.distance}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotspots" className="border-none">
            <AccordionTrigger className="rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" /> Waste Hotspots
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-1 pt-2">
              <div className="space-y-2">
                {mockHotspots.map((h) => (
                  <Card
                    key={h.id}
                    className="cursor-pointer p-3 transition-colors hover:bg-muted/30"
                    onClick={() => handleMarkerSelect("hotspot", h)}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{h.name}</p>
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs text-primary-foreground ${severityColor[h.severity]}`}
                      >
                        {h.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{h.reports} reports</p>
                  </Card>
                ))}
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
              <AlertTriangle className="mr-1 h-3 w-3" /> Hotspots
            </Badge>
          </div>
        </div>
      </aside>

      {/* Map Area */}
      <main className="relative flex flex-1 flex-col bg-muted/20 min-h-0">
        <MapContainer
          center={maduraiCenter}
          zoom={14}
          className="h-full w-full"
          style={{ flex: 1, minHeight: 0 }}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <PanControl />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} />
          <HeatmapLayer points={heatmapData} enabled={heatmap} />

          {/* Toilet Markers */}
          {mockToilets.map((t) => (
            <Marker
              key={`toilet-${t.id}`}
              position={[t.lat, t.lng]}
              icon={toiletIcon}
              eventHandlers={{ click: () => handleMarkerSelect("toilet", t) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm">Rating: {t.rating} ⭐</p>
                  <p className="text-sm">Status: {t.open ? "Open" : "Closed"}</p>
                  <p className="text-sm">Cleanliness: {t.cleanliness}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bin Markers */}
          {mockBins.map((b) => (
            <Marker
              key={`bin-${b.id}`}
              position={[b.lat, b.lng]}
              icon={binIcon}
              eventHandlers={{ click: () => handleMarkerSelect("bin", b) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h4 className="font-semibold">{b.name}</h4>
                  <p className="text-sm">Fill Level: {b.fill}</p>
                  <p className="text-sm">{b.smart ? "Smart IoT Bin" : "Standard Bin"}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hotspot Markers */}
          {mockHotspots.map((h) => (
            <Marker
              key={`hotspot-${h.id}`}
              position={[h.lat, h.lng]}
              icon={hotspotIcon}
              eventHandlers={{ click: () => handleMarkerSelect("hotspot", h) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <h4 className="font-semibold">{h.name}</h4>
                  <p className="text-sm">Severity: {h.severity}</p>
                  <p className="text-sm">{h.reports} reports</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected Marker Popup */}
        {selectedMarker && (
          <div className="absolute bottom-6 left-1/2 w-80 -translate-x-1/2 rounded-xl border bg-card p-4 shadow-lg">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {selectedMarker.type === "toilet" && <MapPin className="h-5 w-5 text-primary" />}
                {selectedMarker.type === "bin" && <Trash2 className="h-5 w-5 text-primary" />}
                {selectedMarker.type === "hotspot" && <AlertTriangle className="h-5 w-5 text-accent" />}
                <h4 className="font-semibold">{selectedMarker.data.name}</h4>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedMarker(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {"rating" in selectedMarker.data && (
                <p className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent" />
                  Rating: {selectedMarker.data.rating}
                </p>
              )}
              {"distance" in selectedMarker.data && (
                <p className="flex items-center gap-1">
                  <Navigation className="h-4 w-4" />
                  Distance: {selectedMarker.data.distance}
                </p>
              )}
              {"cleanliness" in selectedMarker.data && (
                <p>Cleanliness: {selectedMarker.data.cleanliness}</p>
              )}
              {"fill" in selectedMarker.data && <p>Fill Level: {selectedMarker.data.fill}</p>}
              {"severity" in selectedMarker.data && <p>Severity: {selectedMarker.data.severity}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserSmartMap;
