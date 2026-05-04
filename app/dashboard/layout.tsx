"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  Scan,
  ShoppingBag,
  BarChart3,
  Wallet,
  Users,
  Home,
  Menu,
  Bell,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();
  
  const navItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/dashboard" },
    { id: "diagnosis", label: "AI Diagnosis", icon: Scan, href: "/dashboard/detect" },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag, href: "#" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "#" },
    { id: "transactions", label: "Transactions", icon: Wallet, href: "#" },
    { id: "profile", label: "Profile", icon: Users, href: "#" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#1c1b1b] border-r border-[#41493e] transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#41493e]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1b5e20] border border-[#91d78a]/30 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-[#91d78a]" />
          </div>
          {!collapsed && (
            <span className="text-[#e5e2e1] font-bold text-base">AgriTech One</span>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="text-[#8a9386] hover:text-[#91d78a]">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                active
                  ? "bg-[#1b5e20] text-[#91d78a]"
                  : "text-[#8a9386] hover:bg-[#201f1f] hover:text-[#c0c9bb]"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#41493e]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1b5e20]/40 border border-[#91d78a]/20 flex items-center justify-center">
            <span className="text-sm font-bold text-[#91d78a]">BT</span>
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#e5e2e1]">Bayisa Teka</p>
              <p className="text-xs text-[#8a9386]">Farmer</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-[#8a9386] hover:text-[#91d78a]">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-[#131313] border-b border-[#41493e] px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9386]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#1c1b1b] border border-[#41493e] rounded-lg py-2 pl-9 pr-4 text-sm text-[#e5e2e1] placeholder:text-[#8a9386] focus:outline-none focus:border-[#91d78a]"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg text-[#8a9386] hover:text-[#91d78a] hover:bg-[#1c1b1b]">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-[#8a9386] hover:text-[#91d78a] hover:bg-[#1c1b1b]">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#131313]">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "ml-20" : "ml-64")}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}