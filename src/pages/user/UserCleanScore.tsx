import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, MapPin, Trophy, ChevronRight } from "lucide-react";
import { mockAreaScores, mockTrendData } from "@/data/mockData";

const topZones = [...mockAreaScores].sort((a, b) => b.score - a.score).slice(0, 5);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e1e] text-white text-xs px-3 py-2 rounded shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-emerald-400">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const UserCleanScore = () => {
  return (
    <div className="p-6 lg:p-8 bg-[#f3f4f6] min-h-screen text-slate-800 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Clean Score Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time cleanliness analytics for Madurai.</p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "City Clean Score", value: "82", icon: Activity, up: true },
          { title: "Weekly Change", value: "+8%", icon: TrendingUp, up: true },
          { title: "Areas Tracked", value: "8", icon: MapPin, up: true },
          { title: "Cleanest Area", value: "Anna Nagar", icon: Trophy, up: true }
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-none shadow-sm rounded-xl">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Area-wise Bar Chart */}
        <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-800">Area-wise Clean Score</CardTitle>
            <div className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-gray-800">
              Report <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAreaScores} margin={{ top: 20, right: 30, left: -20, bottom: 40 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-45} textAnchor="end" dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden flex flex-col">
          <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-800">7-Day Trend</CardTitle>
            <div className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-gray-800">
              Report <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData} margin={{ top: 20, right: 30, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  activeDot={{ r: 6, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Clean Zones */}
      <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="p-5 border-b border-gray-50">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <div className="bg-amber-50 p-1.5 rounded-md">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            Top 5 Clean Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b-gray-100 hover:bg-transparent">
                <TableHead className="w-16 font-medium text-gray-500 text-xs py-3">Rank</TableHead>
                <TableHead className="font-medium text-gray-500 text-xs py-3">Area</TableHead>
                <TableHead className="font-medium text-gray-500 text-xs py-3">Score</TableHead>
                <TableHead className="text-right font-medium text-gray-500 text-xs py-3">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topZones.map((zone, i) => (
                <TableRow key={zone.area} className="border-b-gray-50 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      {i + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800 text-sm py-3">{zone.area}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 w-6">{zone.score}</span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${zone.score >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${zone.score}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${zone.score >= 90 ? "bg-emerald-50 text-emerald-700" :
                        zone.score >= 80 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                      }`}>
                      {zone.score >= 90 ? "Excellent" : zone.score >= 80 ? "Good" : "Average"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCleanScore;
