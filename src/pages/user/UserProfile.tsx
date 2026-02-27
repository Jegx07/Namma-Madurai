import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Trophy, FileText, CheckCircle, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Reports", value: 12, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: 9, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Points Earned", value: 320, icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Current Rank", value: "#42", icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-8 bg-[#f3f4f6] min-h-screen text-slate-800 font-sans">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and view your civic contributions.</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6 bg-white border-none shadow-sm rounded-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-sm border border-emerald-200/50">
                {user?.avatar || "U"}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user?.name || "User"}</h2>
                <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Citizen</Badge>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100">Verified</Badge>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm rounded-xl h-10 px-4">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white border-none shadow-sm rounded-xl">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Settings */}
        <Card className="bg-white border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-white p-6">
            <CardTitle className="text-base font-semibold text-gray-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" defaultValue={user?.name} className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" defaultValue={user?.email} disabled className="pl-10 h-11 bg-gray-100 border-gray-200 text-gray-500 rounded-xl" />
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            <div>
              <h3 className="mb-5 text-sm font-semibold text-gray-900">Notification Preferences</h3>
              <div className="space-y-4 max-w-2xl">
                {[
                  { label: "Report status updates", description: "Get notified when your report's status changes", enabled: true },
                  { label: "Nearby alerts", description: "Receive alerts for civic issues reported in your immediate area", enabled: true },
                  { label: "Weekly clean score summary", description: "Receive a weekly digest of your area's cleanliness", enabled: false },
                  { label: "Leaderboard updates", description: "Know when your ranking goes up or down", enabled: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                    <div>
                      <span className="text-sm font-medium text-gray-900 block mb-1">{pref.label}</span>
                      <span className="text-xs text-gray-500 block">{pref.description}</span>
                    </div>
                    <Button variant={pref.enabled ? "default" : "outline"} size="sm" className={pref.enabled ? "bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4" : "bg-white text-gray-600 rounded-lg px-4 hover:bg-gray-50"}>
                      {pref.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-100" />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6 h-11">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
