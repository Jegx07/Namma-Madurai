import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, BarChart3, Trophy, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Decorative bg */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-accent blur-3xl" />
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
            <MapPin className="h-4 w-4 text-primary" />
            Smart Civic Intelligence Platform
          </div>

          <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Building a Cleaner,{" "}
            <span className="text-primary">Smarter</span>{" "}
            <span className="text-accent">Madurai</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            Locate public utilities, report cleanliness issues, and support your city with real-time civic intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/map">
              <Button size="lg" className="gap-2 text-base">
                <MapPin className="h-5 w-5" />
                Explore Smart Map
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="outline" size="lg" className="gap-2 text-base">
                <FileText className="h-5 w-5" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">Platform Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "Smart Civic Map", desc: "Find toilets, bins, and hotspots on an interactive map" },
              { icon: FileText, title: "Report Issues", desc: "Upload photos and report civic issues with AI detection" },
              { icon: BarChart3, title: "Clean Score", desc: "Track area-wise cleanliness with real-time dashboards" },
              { icon: Trophy, title: "Leaderboard", desc: "Earn badges and points for civic contributions" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold text-card-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
