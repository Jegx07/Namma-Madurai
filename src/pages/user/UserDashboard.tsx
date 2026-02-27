import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, ArrowRight, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Users, Bell, Search, Activity, FileText, TrendingUp, CheckCircle, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const recentActivity = [
  { id: 1, type: "report", title: "Garbage dump reported", location: "Vilakkuthoon Market", status: "pending" },
  { id: 2, type: "resolved", title: "Overflowing bin resolved", location: "Anna Nagar Bus", status: "resolved" },
  { id: 3, type: "report", title: "Street waste reported", location: "KK Nagar Main", status: "in-progress" },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Citizen";

  return (
    <div className="min-h-screen bg-[#13161c] text-slate-200 font-sans p-6 pb-20 overflow-x-hidden">

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 mt-2">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="rounded-full border border-white/10 hover:bg-white/5 shadow-none">
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <h1 className="text-3xl font-light tracking-widest uppercase text-white">
            {firstName}'s <span className="text-slate-500 font-medium">HUB</span>
          </h1>
        </div>

        <div className="flex items-center gap-8">
          {/* Header Stats */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-light text-white">12</span>
            <div className="flex flex-col">
              <div className="flex items-end gap-[2px] h-4 mb-1">
                {[3, 5, 2, 7, 4, 6, 8, 5, 3, 7, 9, 6, 4, 8, 5].map((h, i) => (
                  <div key={i} className="w-[3px] bg-[#63F148] rounded-[1px]" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">My Reports</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-light text-white">9</span>
            <div className="flex flex-col">
              <div className="flex items-end gap-[2px] h-4 mb-1">
                {[5, 7, 3, 8, 4, 9, 2, 6, 5, 8, 4, 7, 3, 5, 2].map((h, i) => (
                  <div key={i} className="w-[3px] bg-[#FF9900] rounded-[1px]" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Resolved Issues</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-4">
            <span className="text-3xl font-light text-white">3</span>
            <div className="flex flex-col">
              <div className="flex items-end gap-[2px] h-4 mb-1">
                {[4, 6, 8, 3, 5, 7, 9, 4, 6, 8, 5, 7, 4, 6, 8].map((h, i) => (
                  <div key={i} className="w-[3px] bg-[#63F148] rounded-[1px]" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Pending Actions</span>
            </div>
          </div>
        </div>

        <div>
          <Button variant="outline" className="border-white/10 bg-transparent hover:bg-white/5 text-slate-300 gap-2 h-10 px-4 rounded-xl shadow-none">
            <SlidersHorizontal className="h-4 w-4" />
            Customization
          </Button>
        </div>
      </div>

      {/* Main Grid Layout - Dark Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* Card 1: Clean Score Gauge */}
          <Card className="bg-[#1b1f27] border-white/5 shadow-xl rounded-[1.5rem] relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-[#7f8a9e] text-sm">
                  <MapPin className="h-4 w-4" />
                  Madurai Central Zone
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 -mt-1 -mr-2 hover:bg-white/5">
                  <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center">
                    <ArrowRight className="w-2 h-2 -rotate-45" />
                  </div>
                </Button>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div>
                  <div className="flex items-center gap-2 text-[#63F148] text-xs font-semibold mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#63F148]" /> Excellent
                  </div>
                  <h2 className="text-xl font-medium tracking-wide mb-1 text-white">CLEAN SCORE</h2>
                  <p className="text-xs text-[#7f8a9e] font-mono">Top 15% Citywide</p>
                </div>

                {/* circular Gauge text matching image */}
                <div className="relative w-[70px] h-[70px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="35" cy="35" r="33" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="none" />
                    <circle cx="35" cy="35" r="33" stroke="#63F148" strokeWidth="2.5" fill="none" strokeDasharray="207" strokeDashoffset="37" strokeLinecap="round" />
                  </svg>
                  <div className="text-center mt-1">
                    <p className="text-[9px] text-[#7f8a9e] mb-0.5">Score</p>
                    <p className="text-lg font-light text-white leading-none">82</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Recent Activity List / Civic Activity */}
          <Card className="bg-[#1b1f27] border-white/5 shadow-xl rounded-[1.5rem] flex-1">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs tracking-widest text-[#7f8a9e] uppercase">CIVIC ACTIVITY</h3>
                <ArrowUpRight className="h-4 w-4 text-[#7f8a9e]" />
              </div>

              <div className="space-y-4 mb-8">
                {recentActivity.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-white truncate max-w-[180px]">{item.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${item.status === 'resolved' ? 'bg-[#63F148]/20 text-[#63F148]' : 'bg-[#FF9900]/20 text-[#FF9900]'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#7f8a9e] flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </p>
                  </div>
                ))}
              </div>

              {/* Custom Bar Chart Graphic matches image spacing */}
              <div className="mt-auto">
                <div className="flex h-[80px] items-end justify-between border-l border-b border-white/10 pb-2 pl-3 pr-2 relative">
                  {/* Y-axis labels */}
                  <div className="absolute -left-7 bottom-2 flex flex-col justify-between h-full text-[9px] text-[#7f8a9e] py-0">
                    <span>30</span>
                    <span>15</span>
                    <span>0</span>
                  </div>

                  {/* Bars: Twin thin lines per month as shown in image */}
                  {[[15, 12], [14, 10], [18, 15], [20, 18], [16, 14], [14, 12], [22, 18], [19, 15]].map((heights, i) => (
                    <div key={i} className="flex gap-1 items-end h-full relative group">
                      {i === 7 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#63F148] text-[8px]">▼</div>}
                      <div className="w-[1.5px] rounded-t-sm bg-white" style={{ height: `${heights[0] * 3}px` }} />
                      <div className={`w-[1.5px] rounded-t-sm ${i === 7 ? 'bg-[#63F148]' : 'bg-white/40'}`} style={{ height: `${heights[1] * 3}px` }} />
                    </div>
                  ))}
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between pl-3 pr-1 mt-3 text-[10px] text-[#7f8a9e]">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: 3D Visualization Placeholder */}
        <div className="lg:col-span-5 relative group">
          <Card className="bg-[#1b1f27] border-white/5 rounded-[1.5rem] shadow-xl h-full overflow-hidden relative">

            <div className="absolute inset-0 flex items-center justify-center bg-[#181c25]">
              <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-blue-500/10 to-transparent mix-blend-screen" />

              {/* Replaced real estate room image with abstract cityscape to fit Civic theme */}
              <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800"
                className="object-cover w-full h-full opacity-20 mix-blend-luminosity scale-110" alt="Cityscape placeholder" />

              <div className="absolute inset-0 bg-gradient-to-b from-[#1b1f27] via-transparent to-[#1b1f27] opacity-80" />

              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '20px 20px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'bottom' }} />
            </div>

            {/* Bottom right labels */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-6 text-left">
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Total Reports</p>
                <p className="text-xl font-light text-white">4.2K</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Active Users</p>
                <p className="text-xl font-light text-white">1,400</p>
              </div>
              <div>
                <p className="text-[10px] text-[#7f8a9e] mb-1">Resolved</p>
                <p className="text-xl font-light text-white">3.1K</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Card 1: AI Assistant (Green Gradient) */}
          <Card className="bg-gradient-to-br from-[#1c3021] to-[#172021] border-white/5 rounded-[1.5rem] shadow-xl overflow-hidden relative flex-1">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[60%] text-[#63F148]">
                <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0,60 Q25,30 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0,40 Q25,10 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0,70 Q25,80 50,40 T100,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M0,30 Q30,90 60,30 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>

            <CardContent className="p-6 flex flex-col h-full relative z-10 justify-end pt-12">

              <div className="flex justify-center mb-10 absolute top-12 inset-x-0">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-[1rem] border border-white/10">
                  <Mic className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="mb-6 space-y-1 mt-20">
                <p className="text-[13px] font-light text-[#a3b8b0] tracking-wide">I'M HERE <span className="text-white font-medium">TO HELP YOU REPORT</span></p>
                <p className="text-[13px] font-light text-[#a3b8b0] tracking-wide"><span className="text-white font-medium">CIVIC ISSUES</span> EASIER.</p>
                <p className="text-[13px] font-light text-[#a3b8b0] tracking-wide mt-1">HOW CAN <span className="text-white font-medium">I ASSIST YOU</span> TODAY?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="bg-white/5 border-transparent hover:border-white/20 text-[#a3b8b0] hover:text-white hover:bg-white/10 justify-start gap-2 h-11 text-xs shadow-none">
                  <FileText className="h-3.5 w-3.5" /> Track Report
                </Button>
                <Button variant="outline" className="bg-white/5 border-transparent hover:border-white/20 text-[#a3b8b0] hover:text-white hover:bg-white/10 justify-start gap-2 h-11 text-xs shadow-none">
                  <Search className="h-3.5 w-3.5" /> Civic Rules
                </Button>
                <Button variant="outline" className="bg-white/5 border-transparent hover:border-white/20 text-[#a3b8b0] hover:text-white hover:bg-white/10 justify-start gap-2 h-11 text-xs shadow-none">
                  <Users className="h-3.5 w-3.5" /> Contact Auth
                </Button>
                <Button variant="outline" className="bg-white/5 border-transparent hover:border-white/20 text-[#a3b8b0] hover:text-white hover:bg-white/10 justify-start gap-2 h-11 text-xs shadow-none">
                  <TrendingUp className="h-3.5 w-3.5" /> Leaderboards
                </Button>
              </div>

              <div className="relative">
                <Input
                  placeholder="Speak with Namma Assistant"
                  className="bg-white/[0.03] border-white/10 h-[50px] text-sm pl-4 pr-14 text-white placeholder:text-[#a3b8b0]/70 shadow-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-xl"
                />
                <Button size="icon" className="absolute right-1.5 top-1.5 h-[38px] w-[38px] rounded-lg bg-transparent hover:bg-white/10 border border-white/20">
                  <ArrowRight className="h-4 w-4 text-white -rotate-90" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Community Forum */}
          <Card className="bg-gradient-to-br from-[#1c3021] to-[#172021] border-white/5 rounded-[1.5rem] shadow-xl h-[160px]">
            <CardContent className="p-6 flex flex-col justify-between h-full relative">
              <div>
                <h3 className="text-xs tracking-widest text-[#a3b8b0] uppercase font-medium mb-1">COMMUNITY DRIVES</h3>
                <p className="text-[10px] text-[#a3b8b0]/70">Next Event: Sunday 11:00 AM</p>
              </div>

              <div className="flex justify-between items-end">
                <div className="max-w-[70%]">
                  <div className="flex -space-x-2 mb-3">
                    <img src="https://i.pravatar.cc/100?img=4" className="w-6 h-6 rounded-full border border-[#1c3021] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=5" className="w-6 h-6 rounded-full border border-[#1c3021] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=6" className="w-6 h-6 rounded-full border border-[#1c3021] object-cover" />
                    <div className="w-6 h-6 rounded-full border border-[#1c3021] bg-white/10 flex items-center justify-center text-[8px] text-white">+50</div>
                  </div>
                  <p className="text-[11px] text-[#a3b8b0] leading-snug font-medium uppercase tracking-wide">
                    JOIN THE <br /> LOCAL CLEANUP <br /> DRIVE IN ANNA <br /> NAGAR AREA!
                  </p>
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent border-white/10 hover:bg-white/10 rounded-xl shadow-none">
                  <ArrowUpRight className="h-4 w-4 text-[#a3b8b0]" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Row: Light Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* Card 1: CONDITIONAL LIABILITIES -> REPORT BREAKDOWN */}
        <Card className="lg:col-span-4 bg-[#f8fbfa] text-slate-900 border-none rounded-[1.5rem] shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[11px] tracking-widest text-slate-500 uppercase font-medium">REPORT BREAKDOWN</h3>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 mb-8">Citywide Overview</p>

            <div className="flex justify-between items-center">
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">Resolved</p>
                  <p className="text-[28px] font-light leading-none">64<span className="text-sm font-medium text-slate-400">/100</span></p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 mb-1">In Progress</p>
                  <p className="text-[28px] font-light leading-none">36<span className="text-sm font-medium text-slate-400">/100</span></p>
                </div>
              </div>

              {/* Half Gauge Graphic */}
              <div className="relative w-36 h-36 flex flex-col items-center justify-center -mr-2">
                <svg className="absolute w-full h-full transform rotate-180">
                  {/* Background track */}
                  <circle cx="72" cy="72" r="50" stroke="#f1f5f9" strokeWidth="4" fill="none" strokeDasharray="157" strokeDashoffset="0" />
                  {/* Orange path (In Progress) */}
                  <circle cx="72" cy="72" r="50" stroke="#FF9900" strokeWidth="4" fill="none" strokeDasharray="157" strokeDashoffset="90" strokeLinecap="round" />
                  {/* Green path (Resolved) */}
                  <circle cx="72" cy="72" r="50" stroke="#63F148" strokeWidth="4" fill="none" strokeDasharray="157" strokeDashoffset="60" strokeLinecap="round" className="-rotate-[80deg] origin-center" />
                </svg>
                <div className="absolute right-[85px] top-[95px] flex items-center">
                  <div className="bg-[#63F148] text-[#13161c] text-[9px] font-bold px-1.5 py-0.5 rounded z-10 shadow-sm relative mr-2">
                    64%
                  </div>
                  <div className="w-8 border-t border-dashed border-slate-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: RATE TRENDS -> RESOLUTION TRENDS */}
        <Card className="lg:col-span-8 bg-[#f8fbfa] text-slate-900 border-none rounded-[1.5rem] shadow-xl">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[11px] tracking-widest text-slate-500 uppercase font-medium">RESOLUTION TRENDS</h3>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 mb-8">This month vs Last month</p>

            <div className="flex flex-wrap lg:flex-nowrap gap-x-12 gap-y-4 mb-4">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Average Time</p>
                <p className="text-[28px] font-light leading-none">2<span className="text-sm font-medium text-slate-400 ml-1">days</span></p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Peak Time</p>
                <p className="text-[28px] font-light leading-none">5<span className="text-sm font-medium text-slate-400 ml-1">days</span></p>
              </div>
              <div className="relative pl-6 lg:ml-4">
                <div className="absolute left-0 inset-y-0 w-px bg-slate-200" />
                <p className="text-[11px] text-slate-400 mb-2">Efficiency Rating</p>
                <p className="text-xl font-light text-slate-700 leading-none">88%</p>
              </div>
              <div className="lg:ml-auto flex gap-x-12 relative">
                <div className="relative pl-6">
                  <div className="absolute left-0 inset-y-0 w-[2px] bg-[#63F148]" />
                  <p className="text-[11px] text-slate-400 mb-2">Resolved</p>
                  <p className="text-xl font-light text-slate-700 leading-none">64%</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 inset-y-0 w-[2px] bg-[#FF9900]" />
                  <p className="text-[11px] text-slate-400 mb-2">Pending</p>
                  <p className="text-xl font-light text-slate-700 leading-none">36%</p>
                </div>
              </div>
            </div>

            {/* Density bar chart representation */}
            <div className="mt-auto mb-2 flex items-end gap-[1.5px] h-14 w-full px-1">
              {/* Generate tiny bars: dark grey, green, orange, light grey */}
              {Array.from({ length: 140 }).map((_, i) => {
                let color = "bg-slate-500";
                let height = 30 + Math.random() * 40;

                if (i > 105 && i < 125) color = "bg-[#FF9900]"; // Orange section
                if (i > 90 && i <= 105) color = "bg-[#63F148]"; // Green section
                if (i >= 125) {
                  color = "bg-[#FF9900]";
                  // make the tail fade with gray
                  if (i > 130) color = "bg-[#FF9900]/50";
                }
                if (i < 91) color = "bg-slate-600";

                if (i % 4 === 0) height += 10;
                if (i === 115) height = 100;
                if (i === 105) height = 90;
                if (i === 135) height = 90;

                return (
                  <div key={i} className={`flex-1 rounded-[1px] ${color}`} style={{ height: `${height}%` }} />
                )
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono px-2 border-t border-slate-200 pt-2">
              <span>Day 1</span>
              <span>Day 31</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default UserDashboard;
