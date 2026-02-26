export const mockToilets = [
  { id: 1, name: "Meenakshi Temple Public Toilet", lat: 9.9195, lng: 78.1193, rating: 4.2, open: true, gender: "All", distance: "0.3 km", cleanliness: "Good", availability: "Available" },
  { id: 2, name: "Periyar Bus Stand Toilet", lat: 9.9210, lng: 78.1220, rating: 3.5, open: true, gender: "Male", distance: "0.8 km", cleanliness: "Average", availability: "Available" },
  { id: 3, name: "Anna Nagar Public Toilet", lat: 9.9250, lng: 78.1150, rating: 4.7, open: false, gender: "All", distance: "1.2 km", cleanliness: "Excellent", availability: "Closed" },
  { id: 4, name: "KK Nagar Community Toilet", lat: 9.9300, lng: 78.1100, rating: 3.8, open: true, gender: "Female", distance: "1.5 km", cleanliness: "Good", availability: "Available" },
];

export const mockBins = [
  { id: 1, name: "Bin #101 - South Masi St", lat: 9.9180, lng: 78.1200, fill: "Low", smart: true, distance: "0.2 km" },
  { id: 2, name: "Bin #102 - East Veli St", lat: 9.9205, lng: 78.1240, fill: "Medium", smart: true, distance: "0.5 km" },
  { id: 3, name: "Bin #103 - Vilakkuthoon", lat: 9.9230, lng: 78.1180, fill: "Full", smart: false, distance: "0.9 km" },
  { id: 4, name: "Bin #104 - Tallakulam", lat: 9.9270, lng: 78.1130, fill: "Low", smart: true, distance: "1.1 km" },
];

export const mockHotspots = [
  { id: 1, name: "Vaigai River Bank - South", lat: 9.9160, lng: 78.1190, severity: "High", reports: 24 },
  { id: 2, name: "Market Area - Puthu Mandapam", lat: 9.9200, lng: 78.1210, severity: "Medium", reports: 12 },
  { id: 3, name: "Railway Station Approach", lat: 9.9240, lng: 78.1160, severity: "Low", reports: 5 },
];

export const mockAreaScores = [
  { area: "Anna Nagar", score: 92, reports: 5, resolved: 4 },
  { area: "KK Nagar", score: 87, reports: 8, resolved: 7 },
  { area: "Vilakkuthoon", score: 78, reports: 15, resolved: 10 },
  { area: "Tallakulam", score: 85, reports: 6, resolved: 5 },
  { area: "Teppakulam", score: 71, reports: 20, resolved: 12 },
  { area: "Sellur", score: 83, reports: 9, resolved: 7 },
  { area: "Palanganatham", score: 89, reports: 4, resolved: 4 },
  { area: "Thirunagar", score: 76, reports: 12, resolved: 8 },
];

export const mockTrendData = [
  { day: "Mon", score: 74 },
  { day: "Tue", score: 76 },
  { day: "Wed", score: 73 },
  { day: "Thu", score: 78 },
  { day: "Fri", score: 80 },
  { day: "Sat", score: 82 },
  { day: "Sun", score: 84 },
];

export const mockLeaderboard = [
  { rank: 1, name: "Priya Sundaram", points: 2450, badge: "Green Warrior", reports: 48, avatar: "PS" },
  { rank: 2, name: "Rajesh Kumar", points: 2100, badge: "Civic Guardian", reports: 42, avatar: "RK" },
  { rank: 3, name: "Lakshmi Devi", points: 1850, badge: "Street Hero", reports: 37, avatar: "LD" },
  { rank: 4, name: "Arun Prasad", points: 1600, badge: "Segregation Star", reports: 32, avatar: "AP" },
  { rank: 5, name: "Meena Kannan", points: 1400, badge: "Green Warrior", reports: 28, avatar: "MK" },
  { rank: 6, name: "Suresh Babu", points: 1250, badge: "Civic Guardian", reports: 25, avatar: "SB" },
  { rank: 7, name: "Kavitha Raman", points: 1100, badge: "Street Hero", reports: 22, avatar: "KR" },
  { rank: 8, name: "Dinesh Mohan", points: 950, badge: "Segregation Star", reports: 19, avatar: "DM" },
];

export const mockAdminReports = [
  { id: "RPT-001", type: "Garbage Dump", area: "Vilakkuthoon", severity: "High", status: "Pending", reporter: "Priya S.", date: "2026-02-25", assignedTo: "" },
  { id: "RPT-002", type: "Overflowing Bin", area: "Teppakulam", severity: "Medium", status: "In Progress", reporter: "Rajesh K.", date: "2026-02-25", assignedTo: "Worker A" },
  { id: "RPT-003", type: "Street Waste", area: "Sellur", severity: "Low", status: "Resolved", reporter: "Lakshmi D.", date: "2026-02-24", assignedTo: "Worker B" },
  { id: "RPT-004", type: "Hazardous Waste", area: "Anna Nagar", severity: "High", status: "Pending", reporter: "Arun P.", date: "2026-02-24", assignedTo: "" },
  { id: "RPT-005", type: "Garbage Dump", area: "KK Nagar", severity: "Medium", status: "In Progress", reporter: "Meena K.", date: "2026-02-23", assignedTo: "Worker C" },
];

export const mockBinAlerts = [
  { id: "BIN-101", location: "South Masi St", fill: 95, lastCollected: "2 hours ago", status: "Critical" },
  { id: "BIN-103", location: "Vilakkuthoon", fill: 88, lastCollected: "5 hours ago", status: "Warning" },
  { id: "BIN-107", location: "Teppakulam", fill: 92, lastCollected: "3 hours ago", status: "Critical" },
];

export const badgeColors: Record<string, string> = {
  "Green Warrior": "bg-primary text-primary-foreground",
  "Civic Guardian": "bg-accent text-accent-foreground",
  "Street Hero": "bg-secondary text-secondary-foreground",
  "Segregation Star": "bg-muted text-foreground",
};
