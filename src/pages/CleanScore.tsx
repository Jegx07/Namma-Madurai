import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { mockAreaScores, mockTrendData } from "@/data/mockData";

const stats = [
  { label: "City Clean Score", value: "82", icon: Activity, color: "text-primary" },
  { label: "Today's Reports", value: "34", icon: FileText, color: "text-accent" },
  { label: "Resolved Issues", value: "28", icon: CheckCircle, color: "text-primary" },
  { label: "Smart Bin Alerts", value: "6", icon: AlertTriangle, color: "text-destructive" },
];

const CleanScore = () => {
  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Clean Score Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Real-time cleanliness analytics for Madurai.</p>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Area-wise Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockAreaScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(125, 54%, 33%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">7-Day Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(43, 55%, 51%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area ranking table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Area-wise Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Resolved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...mockAreaScores].sort((a, b) => b.score - a.score).map((a, i) => (
                <TableRow key={a.area}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{a.area}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${a.score >= 85 ? "text-primary" : a.score >= 75 ? "text-accent" : "text-destructive"}`}>
                      {a.score}
                    </span>
                  </TableCell>
                  <TableCell>{a.reports}</TableCell>
                  <TableCell>{a.resolved}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CleanScore;
