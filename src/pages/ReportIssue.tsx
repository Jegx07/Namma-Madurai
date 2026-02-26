import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, CheckCircle, Upload } from "lucide-react";

const ReportIssue = () => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId] = useState(`RPT-${Math.floor(100000 + Math.random() * 900000)}`);

  if (submitted) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Report Submitted!</h2>
            <p className="mb-4 text-muted-foreground">Your report has been received and assigned.</p>
            <div className="mb-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
              <p><span className="font-medium">Ticket ID:</span> {ticketId}</p>
              <p><span className="font-medium">Estimated Resolution:</span> 24–48 hours</p>
            </div>
            <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another Report</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Report an Issue</h1>
      <p className="mb-8 text-muted-foreground">Help keep Madurai clean by reporting civic issues.</p>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>Fill in the details below to submit your report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo upload */}
          <div>
            <Label className="mb-2 block">Photo</Label>
            <div className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click to upload or drag photo here</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="mb-2 block">Location</Label>
            <div className="flex gap-2">
              <Input placeholder="Auto-detected location" readOnly className="flex-1" />
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" /> Detect
              </Button>
            </div>
          </div>

          {/* Waste type */}
          <div>
            <Label className="mb-2 block">Waste Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="garbage">Garbage Dump</SelectItem>
                <SelectItem value="overflow">Overflowing Bin</SelectItem>
                <SelectItem value="street">Street Waste</SelectItem>
                <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                <SelectItem value="ewaste">E-Waste</SelectItem>
                <SelectItem value="construction">Construction Debris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div>
            <Label className="mb-2 block">Severity</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" size="lg" onClick={() => setSubmitted(true)}>
            Submit Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;
