"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Scan,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Package,
  Leaf,
  Wallet,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ title, value, change, icon: Icon, color }: any) {
  const isPositive = change?.startsWith("+");

  return (
    <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[#e5e2e1] mb-1">{value}</p>
      <p className="text-sm text-[#8a9386]">{title}</p>
    </div>
  );
}

type RecentDiagnosis = {
  id: number;
  crop: string;
  disease: string;
  date: string;
  confidence: number;
  status: "healthy" | "low" | "medium" | "high" | "critical";
};

export default function OverviewPage() {
  const [recentUploads, setRecentUploads] = useState<RecentDiagnosis[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("agritech_recent_diagnoses");
      const items = stored ? (JSON.parse(stored) as RecentDiagnosis[]) : [];
      setRecentUploads(items);
    } catch {
      setRecentUploads([]);
    }
  }, []);

  const getStatusColor = (status: RecentDiagnosis["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "low":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "medium":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "critical":
        return "text-red-400 bg-red-500/15 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/detect">
          <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl p-4 text-center hover:border-[#91d78a]/40 hover:bg-[#201f1f] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-[#1b5e20] mx-auto mb-2 flex items-center justify-center">
              <Scan className="w-5 h-5 text-[#91d78a]" />
            </div>
            <p className="text-sm font-medium text-[#c0c9bb]">New Scan</p>
          </div>
        </Link>
        <Link href="/dashboard/marketplace">
          <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl p-4 text-center hover:border-[#91d78a]/40 hover:bg-[#201f1f] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-[#2e7d32] mx-auto mb-2 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#91d78a]" />
            </div>
            <p className="text-sm font-medium text-[#c0c9bb]">Buy Inputs</p>
          </div>
        </Link>
        <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl p-4 text-center hover:border-[#91d78a]/40 hover:bg-[#201f1f] transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-[#388e3c] mx-auto mb-2 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-[#91d78a]" />
          </div>
          <p className="text-sm font-medium text-[#c0c9bb]">My Crops</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Diagnoses" value="24" change="+12%" icon={Scan} color="bg-[#1b5e20]/20 text-[#91d78a]" />
        <StatCard title="Crops Saved" value="18" change="+8%" icon={Leaf} color="bg-[#2e7d32]/20 text-[#91d78a]" />
        <StatCard title="Products Bought" value="9" change="+3" icon={ShoppingBag} color="bg-[#388e3c]/20 text-[#91d78a]" />
        <StatCard title="Money Saved" value="2,450 ETB" change="-15%" icon={Wallet} color="bg-[#4caf50]/20 text-[#91d78a]" />
      </div>

      {/* Recent Diagnoses */}
      <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-[#41493e]">
          <div>
            <h3 className="text-lg font-semibold text-[#e5e2e1]">Recent Diagnoses</h3>
            <p className="text-sm text-[#8a9386]">Your last AI crop analyses</p>
          </div>
          <Link href="/dashboard/detect">
            <button className="text-sm text-[#91d78a] hover:text-[#acf4a4] flex items-center gap-1">
              New Scan <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[#c0c9bb]">
            <thead className="border-b border-[#41493e] bg-[#151515]">
              <tr className="text-left text-xs text-[#8a9386]">
                <th className="px-3 sm:px-5 py-3 font-medium">Crop</th>
                <th className="px-3 sm:px-5 py-3 font-medium">Disease</th>
                <th className="px-3 sm:px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-3 sm:px-5 py-3 font-medium hidden md:table-cell">Confidence</th>
                <th className="px-3 sm:px-5 py-3 font-medium">Status</th>
                <th className="px-3 sm:px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentUploads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-sm text-[#8a9386]">
                    No scans yet. Run a diagnosis to see results here.
                  </td>
                </tr>
              )}
              {recentUploads.map((d) => (
                <tr key={d.id} className="border-b border-[#41493e] hover:bg-[#201f1f] transition-colors">
                  <td className="px-3 sm:px-5 py-3 text-sm text-[#c0c9bb]">{d.crop}</td>
                  <td className="px-3 sm:px-5 py-3 text-sm text-[#e5e2e1]">{d.disease}</td>
                  <td className="px-3 sm:px-5 py-3 text-sm text-[#8a9386] hidden md:table-cell">{d.date}</td>
                  <td className="px-3 sm:px-5 py-3 text-sm text-[#91d78a] hidden md:table-cell">{d.confidence}%</td>
                  <td className="px-3 sm:px-5 py-3">
                    <span className={cn("text-xs px-2 py-1 rounded-full border", getStatusColor(d.status))}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <button className="text-[#8a9386] hover:text-[#91d78a]">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="bg-[#1c1b1b] border border-[#41493e] rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-[#41493e]">
          <div>
            <h3 className="text-lg font-semibold text-[#e5e2e1]">Recommended for You</h3>
            <p className="text-sm text-[#8a9386]">Based on your recent diagnoses</p>
          </div>
          <Link href="/dashboard/marketplace">
            <button className="text-sm text-[#91d78a] hover:text-[#acf4a4] flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: "Copper Fungicide", price: "450 ETB", seller: "Adama Agro", rating: 4.8 },
            { name: "Hybrid Maize Seed", price: "850 ETB", seller: "EthioSeed", rating: 4.9 },
            { name: "Organic Neem Oil", price: "320 ETB", seller: "GreenFarm", rating: 4.7 },
          ].map((p) => (
            <div key={p.name} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-lg bg-[#131313] border border-[#41493e] hover:border-[#91d78a]/30 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#1b5e20]/20 border border-[#91d78a]/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#91d78a]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#e5e2e1] text-sm">{p.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#8a9386]">{p.seller}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#91d78a] text-[#91d78a]" />
                    <span className="text-xs text-[#c0c9bb]">{p.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#91d78a] text-sm">{p.price}</p>
                <button className="mt-1 text-xs text-[#8a9386] hover:text-[#91d78a]">Buy now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}