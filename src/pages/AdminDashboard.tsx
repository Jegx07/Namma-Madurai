import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, Users, FileText } from "lucide-react";
import { mockAdminReports, mockBinAlerts, mockAreaScores } from "@/data/mockData";

const statusColor: Record<string, string> = {
  Pending: "bg-accent text-accent-foreground",
  "In Progress": "bg-primary text-primary-foreground",
  Resolved: "bg-muted text-foreground",
};

const AdminDashboard = () => {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Restricted access — Municipal Administration</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Reports", value: "156", icon: FileText },
          { label: "Pending", value: "23", icon: AlertTriangle },
          { label: "Active Workers", value: "12", icon: Users },
          { label: "Bin Alerts", value: "3", icon: AlertTriangle },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 pt-6">
              <s.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminReports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.type}</TableCell>
                    <TableCell className="text-sm">{r.area}</TableCell>
                    <TableCell>
                      <Badge variant={r.severity === "High" ? "destructive" : r.severity === "Medium" ? "default" : "secondary"} className="text-xs">
                        {r.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block rounded px-2 py-0.5 text-xs ${statusColor[r.status]}`}>{r.status}</span>
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue placeholder="Assign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Worker A</SelectItem>
                          <SelectItem value="b">Worker B</SelectItem>
                          <SelectItem value="c">Worker C</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bin alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smart Bin Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockBinAlerts.map((b) => (
              <div key={b.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{b.id}</span>
                  <Badge variant={b.status === "Critical" ? "destructive" : "default"} className="text-xs">{b.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{b.location}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-destructive" style={{ width: `${b.fill}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Last collected: {b.lastCollected}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Area Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockAreaScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="area" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="hsl(43, 55%, 51%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="hsl(125, 54%, 33%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
