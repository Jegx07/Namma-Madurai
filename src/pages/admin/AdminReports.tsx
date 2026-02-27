import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Filter, Eye, UserPlus, CheckCircle, MapPin, Clock, Loader2 } from "lucide-react";
import { supabaseReports } from "@/lib/supabase";

interface Report {
  id: string;
  user_id: string;
  user_name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-accent text-accent-foreground",
  "in-progress": "bg-primary text-primary-foreground",
  resolved: "bg-muted text-foreground",
};

const typeToSeverity: Record<string, string> = {
  garbage: "Medium",
  overflow: "High",
  damage: "High",
  other: "Low",
};

const severityVariants: Record<string, "destructive" | "default" | "secondary"> = {
  High: "destructive",
  Medium: "default",
  Low: "secondary",
};

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    // Fetch initial reports
    const fetchReports = async () => {
      try {
        const data = await supabaseReports.getAll();
        setReports(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // Subscribe to real-time changes
    const subscription = supabaseReports.subscribeToChanges((payload) => {
      console.log("Real-time update:", payload);
      // Refresh reports on any change
      fetchReports();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (reportId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    try {
      await supabaseReports.updateStatus(reportId, newStatus);
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">All Reports</h1>
        <p className="text-muted-foreground">View and manage all citizen reports</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, area, or type..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Waste Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const severity = typeToSeverity[report.type] || "Medium";
                return (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-sm">{report.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {report.address || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{report.type}</TableCell>
                  <TableCell>
                    <Badge variant={severityVariants[severity]}>{severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium capitalize ${statusColors[report.status]}`}>
                      {report.status.replace("-", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      {report.status !== "resolved" && (
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            setSelectedReport(report);
                            setAssignModalOpen(true);
                          }}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* View Report Modal */}
      <Dialog open={!!selectedReport && !assignModalOpen} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Report ID: {selectedReport?.id.slice(0, 8)}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedReport.address || `${selectedReport.latitude.toFixed(4)}, ${selectedReport.longitude.toFixed(4)}`}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Waste Type</Label>
                  <p className="font-medium capitalize">{selectedReport.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Severity</Label>
                  <Badge variant={severityVariants[typeToSeverity[selectedReport.type] || "Medium"]} className="mt-1">
                    {typeToSeverity[selectedReport.type] || "Medium"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className={`inline-block mt-1 rounded px-2 py-0.5 text-sm font-medium capitalize ${statusColors[selectedReport.status]}`}>
                    {selectedReport.status.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reporter</Label>
                  <p className="font-medium">{selectedReport.user_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{new Date(selectedReport.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedReport.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedReport.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            {selectedReport?.status !== "resolved" && (
              <Button
                onClick={() => setAssignModalOpen(true)}
                className="gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Assign Worker
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
            <DialogDescription>
              Assign a field worker to handle report {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Worker</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose worker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker-a">Worker A - Available</SelectItem>
                  <SelectItem value="worker-b">Worker B - Available</SelectItem>
                  <SelectItem value="worker-c">Worker C - Busy</SelectItem>
                  <SelectItem value="worker-d">Worker D - Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Add any special instructions for the worker..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-1"
              onClick={() => {
                setAssignModalOpen(false);
                setSelectedReport(null);
              }}
            >
              <CheckCircle className="h-4 w-4" />
              Assign & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
