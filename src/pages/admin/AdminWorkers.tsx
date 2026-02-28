import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, CheckCircle, Clock, MapPin, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  area: string;
  status: 'active' | 'on-leave' | 'inactive';
  tasks_completed: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: "bg-primary text-primary-foreground",
  'on-leave': "bg-muted text-muted-foreground",
  inactive: "bg-destructive text-destructive-foreground",
};

const statusLabels: Record<string, string> = {
  active: "Available",
  'on-leave': "On Leave",
  inactive: "Inactive",
};

const AdminWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setWorkers(data || []);
      } catch (err) {
        console.error('Error fetching workers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();

    // Real-time subscription
    const channel = supabase
      .channel('admin-workers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, () => {
        fetchWorkers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const availableCount = workers.filter((w) => w.status === "active").length;
  const onLeaveCount = workers.filter((w) => w.status === "on-leave").length;
  const totalTasks = workers.reduce((acc, w) => acc + w.tasks_completed, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assign Workers</h1>
          <p className="text-muted-foreground">Manage field workers and task assignments</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Worker
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{workers.length}</p>
              <p className="text-sm text-muted-foreground">Total Workers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{availableCount}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{onLeaveCount}</p>
              <p className="text-sm text-muted-foreground">On Leave</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
              <p className="text-sm text-muted-foreground">Tasks Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Field Workers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No workers found. Add workers to get started.
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tasks Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-xs text-muted-foreground">{worker.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {worker.area}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {worker.phone || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[worker.status]}>{statusLabels[worker.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{worker.tasks_completed}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      {worker.status === "active" && (
                        <Button size="sm">Assign Task</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWorkers;
