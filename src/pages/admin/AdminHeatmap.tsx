import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer, MapPin, AlertTriangle, TrendingUp, Calendar, Hand, Crosshair } from "lucide-react";
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

const hotspotZones = [
  { name: "Vaigai River Bank - South", lat: 9.9160, lng: 78.1190, reports: 24, severity: "High", trend: "up" },
  { name: "Market Area - Puthu Mandapam", lat: 9.9200, lng: 78.1210, reports: 18, severity: "High", trend: "up" },
  { name: "Teppakulam Lake Side", lat: 9.9130, lng: 78.1250, reports: 15, severity: "Medium", trend: "stable" },
  { name: "Railway Station Approach", lat: 9.9240, lng: 78.1160, reports: 12, severity: "Medium", trend: "down" },
  { name: "Periyar Bus Stand", lat: 9.9210, lng: 78.1220, reports: 10, severity: "Medium", trend: "stable" },
  { name: "Vilakkuthoon Market", lat: 9.9230, lng: 78.1180, reports: 8, severity: "Low", trend: "down" },
];

// Heatmap layer component
const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    // @ts-expect-error leaflet.heat types not available
    const heat = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1: "red" },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

// Custom marker icon for hotspots
const hotspotMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Pan Control Component
const PanControl = () => {
  const map = useMap();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isPanActive, setIsPanActive] = useState(true);

  useEffect(() => {
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

const severityColors: Record<string, string> = {
  High: "bg-destructive text-destructive-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-muted text-foreground",
};

const AdminHeatmap = () => {
  // Madurai center coordinates
  const maduraiCenter: [number, number] = [9.9195, 78.1193];

  // Heatmap data from hotspot zones
  const heatmapData: [number, number, number][] = hotspotZones.map((zone) => [
    zone.lat,
    zone.lng,
    zone.severity === "High" ? 1 : zone.severity === "Medium" ? 0.6 : 0.3,
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Heatmap Intelligence</h1>
          <p className="text-muted-foreground">Visualize report density and identify problem areas</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Custom Range
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Heatmap Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Thermometer className="h-5 w-5 text-primary" />
              Report Density Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 rounded-lg overflow-hidden">
              <MapContainer
                center={maduraiCenter}
                zoom={14}
                className="h-full w-full"
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
                <HeatmapLayer points={heatmapData} />

                {/* Hotspot Markers */}
                {hotspotZones.map((zone) => (
                  <Marker
                    key={zone.name}
                    position={[zone.lat, zone.lng]}
                    icon={hotspotMarkerIcon}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm">Reports: {zone.reports}</p>
                        <p className="text-sm">Severity: {zone.severity}</p>
                        <p className="text-sm">
                          Trend: {zone.trend === "up" ? "↑ Increasing" : zone.trend === "down" ? "↓ Decreasing" : "→ Stable"}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-primary" /> Low (&lt;10)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-accent" /> Medium (10-20)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-destructive" /> High (20+)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Hotspot Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Hotspot Zones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hotspotZones.map((zone) => (
              <div
                key={zone.name}
                className="rounded-lg border p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{zone.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{zone.reports} reports</p>
                  </div>
                  <Badge className={severityColors[zone.severity]}>{zone.severity}</Badge>
                </div>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <TrendingUp
                    className={`h-3.5 w-3.5 mr-1 ${
                      zone.trend === "up"
                        ? "text-destructive"
                        : zone.trend === "down"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  {zone.trend === "up" && "Increasing"}
                  {zone.trend === "down" && "Decreasing"}
                  {zone.trend === "stable" && "Stable"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Zone Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Zone Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Hotspots", value: "6", change: "+2 this week" },
              { label: "Critical Zones", value: "2", change: "Needs attention" },
              { label: "Avg Reports/Zone", value: "14", change: "+3 vs last week" },
              { label: "Resolution Rate", value: "78%", change: "Improving" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeatmap;
