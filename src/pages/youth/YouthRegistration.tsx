import { useState } from "react";
import {
  Building2, MapPin, User, Mail, Phone, Upload, Hash, CheckCircle2, Clock, XCircle, RotateCcw, Send
} from "lucide-react";

const wards = Array.from({ length: 72 }, (_, i) => `Ward ${i + 1}`);
const institutionTypes = ["School", "College", "NGO"];

const generateCode = (type: string) => {
  const prefix = type === "School" ? "SCH" : type === "College" ? "COL" : "NGO";
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NM-${prefix}-${rand}`;
};

const YouthRegistration = () => {
  const [form, setForm] = useState({
    name: "", type: "School", address: "", ward: "Ward 1",
    contactPerson: "", email: "", phone: "", logo: null as File | null,
  });
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status] = useState<"pending" | "approved" | "rejected">("pending");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Institution name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.contactPerson.trim()) e.contactPerson = "Contact person is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setCode(generateCode(form.type));
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", type: "School", address: "", ward: "Ward 1", contactPerson: "", email: "", phone: "", logo: null });
    setErrors({});
    setSubmitted(false);
    setCode("");
  };

  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Pending Approval" },
    approved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Approved" },
    rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Rejected" },
  };

  const InputField = ({ icon: Icon, label, id, type = "text", placeholder, value, onChange, error }: any) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 ${error ? "border-red-300 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );

  if (submitted) {
    const sc = statusConfig[status];
    const StatusIcon = sc.icon;
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Registration Submitted!</h2>
              <p className="mt-2 text-sm text-gray-500">Your institution has been registered successfully.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Institution Code</p>
              <p className="text-2xl font-mono font-bold text-emerald-600 tracking-wider">{code}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${sc.bg}`}>
              <StatusIcon className={`h-4 w-4 ${sc.color}`} />
              <span className={`text-sm font-semibold ${sc.color}`}>{sc.label}</span>
            </div>
            <button onClick={handleReset} className="block mx-auto text-sm text-emerald-600 font-semibold hover:underline">
              Register Another Institution
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Youth Civic Impact</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institution Registration</h1>
          <p className="mt-2 text-gray-500 text-sm">Register your institution to join the City Cleanliness Program</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <InputField icon={Building2} label="Institution Name" id="name" placeholder="e.g., Government Higher Secondary School"
                value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />Institution Type
              </label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                {institutionTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />Ward Selection
              </label>
              <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                {wards.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <InputField icon={MapPin} label="Address" id="address" placeholder="Full institutional address"
                value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} error={errors.address} />
            </div>

            <InputField icon={User} label="Contact Person" id="contact" placeholder="Full name"
              value={form.contactPerson} onChange={(e: any) => setForm({ ...form, contactPerson: e.target.value })} error={errors.contactPerson} />

            <InputField icon={Mail} label="Email" id="email" type="email" placeholder="email@institution.com"
              value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} error={errors.email} />

            <InputField icon={Phone} label="Phone Number" id="phone" type="tel" placeholder="10-digit number"
              value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-gray-400" />Upload Logo
              </label>
              <label className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-200 px-4 py-4 text-sm text-gray-400 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
                <Upload className="h-4 w-4" />
                <span>{form.logo ? form.logo.name : "Choose file"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm({ ...form, logo: e.target.files?.[0] || null })} />
              </label>
            </div>
          </div>

          {/* Auto-generated code preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <Hash className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Auto-generated Code</p>
              <p className="text-sm font-mono font-semibold text-gray-600">{generateCode(form.type)}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors">
              <Send className="h-4 w-4" /> Submit for Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouthRegistration;
