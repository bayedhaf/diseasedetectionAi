"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  Brain,
  CloudRain,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Star,
  Smartphone,
  ShoppingBag,
  Sprout,
  Scan,
  TrendingUp,
  Users,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = to / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= to) { setCount(to); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Image placeholder component ─────────────────────────────────────────────
function ImgPlaceholder({
  className,
  label = "Image placeholder",
  aspectRatio = "aspect-video",
}: {
  className?: string;
  label?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1rem] bg-[#1c1b1b] border border-[#41493e] flex items-center justify-center",
        aspectRatio,
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#41493e 1px, transparent 1px), linear-gradient(90deg, #41493e 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((cls, i) => (
        <span
          key={i}
          className={cn("absolute w-5 h-5 border-[#91d78a]", cls)}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <div className="w-10 h-10 rounded-full bg-[#1b5e20]/30 border border-[#91d78a]/30 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-[#91d78a]/60" />
        </div>
        <p className="text-[11px] font-medium text-[#8a9386] uppercase tracking-widest">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Features", "How it works", "Testimonials", "Pricing"];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#131313]/90 backdrop-blur-md border-b border-[#41493e]/60"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[0.5rem] bg-[#1b5e20] border border-[#91d78a]/30 flex items-center justify-center group-hover:border-[#91d78a]/70 transition-colors">
            <Sprout className="w-4 h-4 text-[#91d78a]" />
          </div>
          <span
            className="text-[#e5e2e1] font-bold text-base tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            AgriTech One
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-[#c0c9bb] hover:text-[#91d78a] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="#">
            <Button
              variant="ghost"
              className="text-sm text-[#c0c9bb] hover:text-[#91d78a] hover:bg-transparent"
            >
              Sign in
            </Button>
          </Link>
          <Link href="#">
            <Button className="h-9 px-5 text-sm rounded-[0.5rem] bg-[#1b5e20] hover:bg-[#2e7d32] text-white border border-[#91d78a]/20 hover:border-[#91d78a]/50 transition-all">
              Get started free
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#c0c9bb] hover:text-[#91d78a] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#1c1b1b] border-t border-[#41493e] px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="block text-sm text-[#c0c9bb] hover:text-[#91d78a] py-2 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="#" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full h-10 text-sm rounded-[0.5rem] border-[#41493e] text-[#c0c9bb] bg-transparent hover:bg-[#201f1f] hover:text-[#91d78a]">
                Sign in
              </Button>
            </Link>
            <Link href="#" onClick={() => setOpen(false)}>
              <Button className="w-full h-10 text-sm rounded-[0.5rem] bg-[#1b5e20] hover:bg-[#2e7d32] text-white">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-175 h-125 rounded-full bg-[#1b5e20]/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-[#91d78a]/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#91d78a 1px, transparent 1px), linear-gradient(90deg, #91d78a 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1b5e20]/20 border border-[#91d78a]/20 rounded-full px-3.5 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#91d78a] animate-pulse" />
              <span
                className="text-xs font-bold text-[#91d78a] uppercase tracking-widest"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                AI-Powered Crop Intelligence
              </span>
            </div>

            <h1
              className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-[#e5e2e1] leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Detect. Treat. Buy.{" "}
              <span
                className="relative inline-block text-[#91d78a]"
              >
                Grow.
                <span className="absolute bottom-1 left-0 right-0 h-px bg-linear-to-r from-[#91d78a]/0 via-[#91d78a]/60 to-[#91d78a]/0" />
              </span>
            </h1>

            <p
              className="text-base text-[#c0c9bb] leading-relaxed mb-8 max-w-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              One phone, one app. Instantly detect crop disease, get the right cure,
              and buy verified products. No experts needed. No more guessing.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/scan">
                <Button className="h-12 px-7 text-sm font-semibold rounded-[0.5rem] bg-[#91d78a] hover:bg-[#acf4a4] text-[#003909] transition-all hover:scale-[1.02] active:scale-[0.98] group">
                  Start diagnosing
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-12 px-7 text-sm font-semibold rounded-[0.5rem] bg-transparent border-[#41493e] text-[#c0c9bb] hover:bg-[#1c1b1b] hover:border-[#8a9386] hover:text-[#e5e2e1] transition-all"
              >
                Watch demo
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-5 flex-wrap">
              {["No credit card", "Free forever tier", "Works offline"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#91d78a] shrink-0" />
                  <span
                    className="text-xs text-[#8a9386]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1rem] border border-[#41493e] bg-[#131313]">
              <img
                src="/upload/field.png"
                alt="AI Disease Detection Demo"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-4 -left-4 bg-[#201f1f] border border-[#41493e] rounded-[1rem] px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <Scan className="w-3 h-3 text-[#91d78a]" />
                <p
                  className="text-[10px] font-bold uppercase tracking-widest text-[#8a9386]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Diagnosis Time
                </p>
              </div>
              <p
                className="text-2xl font-bold text-[#91d78a]"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                &lt;3<span className="text-sm font-normal text-[#8a9386]"> seconds</span>
              </p>
            </div>
            {/* Floating disease badge */}
            <div className="absolute -top-4 -right-4 bg-[#201f1f] border border-[#41493e] rounded-[1rem] px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#91d78a]" />
                <p
                  className="text-xs font-semibold text-[#e5e2e1]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  AI Diagnosis
                </p>
              </div>
              <p
                className="text-sm font-bold text-[#91d78a] mt-1"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                Early Blight
              </p>
              <p className="text-[10px] text-[#8a9386]">Confidence 94%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: 20000, suffix: "+", label: "Farmers onboarded", icon: Users },
    { value: 98, suffix: "%", label: "Detection accuracy", icon: Brain },
    { value: 3, suffix: "s", label: "Average diagnosis", icon: Zap },
    { value: 100, suffix: "%", label: "Verified products", icon: Shield },
  ];
  return (
    <section className="border-y border-[#41493e] bg-[#1c1b1b]/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[#41493e]">
        {items.map((s) => (
          <div key={s.label} className="text-center px-6">
            <div className="flex justify-center mb-2">
              <s.icon className="w-5 h-5 text-[#91d78a]" />
            </div>
            <p
              className="text-3xl font-bold text-[#91d78a] mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p
              className="text-sm text-[#8a9386]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Scan,
      title: "AI Disease Detection",
      desc: "Photograph any leaf and our AI identifies the disease, severity, and spread risk in under 3 seconds.",
      tag: "AI",
    },
    {
      icon: ShoppingBag,
      title: "Verified Marketplace",
      desc: "Buy certified seeds and approved chemicals only from vetted, trusted sellers. No more fake inputs.",
      tag: "Marketplace",
    },
    {
      icon: Globe,
      title: "Local Language Support",
      desc: "Step-by-step instructions in Afaan Oromo & Amharic. Built for Ethiopian farmers, by Ethiopians.",
      tag: "Localization",
    },
    {
      icon: Brain,
      title: "Smart Recommendations",
      desc: "Get the correct chemical, safe dosage, and prevention tips - all in one screen.",
      tag: "AI",
    },
    {
      icon: Zap,
      title: "Instant Diagnosis",
      desc: "No experts needed. No more guessing. One photo tells you exactly what your crop needs.",
      tag: "Speed",
    },
    {
      icon: Shield,
      title: "100% Verified",
      desc: "Every product in our marketplace is certified. We protect farmers from fake seeds and chemicals.",
      tag: "Trust",
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-[#41493e] text-[#91d78a] bg-[#1b5e20]/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1"
          >
            Platform Features
          </Badge>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#e5e2e1] tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Everything a farmer needs
            <br />
            <span className="text-[#91d78a]">in one app</span>
          </h2>
          <p
            className="mt-4 text-[#8a9386] text-base max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Detect → Treat → Buy → Grow. No experts needed. No more guessing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-[#1c1b1b] border border-[#41493e] rounded-[1rem] p-6 hover:border-[#91d78a]/40 hover:bg-[#201f1f] transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-[0.75rem] bg-[#1b5e20]/30 border border-[#91d78a]/20 flex items-center justify-center group-hover:bg-[#1b5e20]/50 transition-colors">
                  <f.icon className="w-5 h-5 text-[#91d78a]" />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest text-[#8a9386] bg-[#2a2a2a] border border-[#41493e] rounded-full px-2.5 py-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {f.tag}
                </span>
              </div>
              <h3
                className="text-base font-semibold text-[#e5e2e1] mb-2"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm text-[#8a9386] leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {f.desc}
              </p>
              <div className="absolute inset-0 rounded-[1rem] bg-linear-to-br from-[#91d78a]/0 to-[#91d78a]/0 group-hover:from-[#91d78a]/3 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Scan the Crop",
      desc: "Farmer points the phone camera at the sick leaf. Real-time scanning begins instantly — no setup needed.",
      image: "/upload/farmerscanland.png",
    },
    {
      num: "02",
      title: "AI Analyses Instantly",
      desc: "Disease name, confidence score, and severity level appear in under 3 seconds — right on screen.",
      image: "/upload/AIAnalysisResultsScreen.png",
    },
    {
      num: "03",
      title: "Get the Recommendation",
      desc: "Correct chemical, safe dosage, Afaan Oromo instructions — and a Buy Now button. All in one screen.",
      image: "/upload/TreatmentRecommendationScreen.png",
    },
    {
      num: "04",
      title: "Buy Verified Products",
      desc: "Purchase certified inputs directly from trusted sellers. Safe, verified, delivered to your farm.",
      image: "/upload/marketplace.png",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#1c1b1b]/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-[#41493e] text-[#91d78a] bg-[#1b5e20]/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1"
          >
            How it works
          </Badge>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#e5e2e1] tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            From sick crop to solution
            <br />
            <span className="text-[#91d78a]">in three simple steps</span>
          </h2>
        </div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={cn(
                "grid lg:grid-cols-2 gap-10 items-center",
                i % 2 === 1 && "lg:grid-flow-dense"
              )}
            >
              <div className={cn(i % 2 === 1 && "lg:col-start-2")}>
                <div
                  className="text-[3.5rem] font-bold text-[#91d78a]/15 leading-none mb-3 select-none"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-xl font-bold text-[#e5e2e1] mb-3"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#8a9386] leading-relaxed mb-5"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.desc}
                </p>
                <div className="flex items-center gap-1.5 text-[#91d78a] text-sm font-medium">
                  Learn more
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className={cn(i % 2 === 1 && "lg:col-start-1 lg:row-start-1")}>
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[1rem] border border-[#41493e] bg-[#131313]">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const items = [
    {
      quote:
        "I lost 40% of my maize last year to a disease I couldn't name. With AgriTech One, I diagnosed it in 3 seconds and bought the right treatment. My crops have never been healthier.",
      name: "Bayisa Balcha",
      role: "Founder, AgriTech One · Oromia",
      stars: 5,
    },
    {
      quote:
        "The AI disease detection saved our tomato crop. I photographed a leaf and had a fungicide prescription immediately. No expert needed. No more guessing.",
      name: "Tigist Bekele",
      role: "Greenhouse farmer · Bishoftu",
      stars: 5,
    },
    {
      quote:
        "Finally, an app that understands Ethiopian farmers. Local language support, verified products, and instant diagnosis. This is the future of Ethiopian agriculture.",
      name: "Dereje Alemu",
      role: "Teff farmer · Amhara region",
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-[#41493e] text-[#91d78a] bg-[#1b5e20]/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1"
          >
            Testimonials
          </Badge>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#e5e2e1] tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Trusted by farmers
            <br />
            <span className="text-[#91d78a]">across Ethiopia</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div
              key={t.name}
              className="bg-[#1c1b1b] border border-[#41493e] rounded-[1rem] p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#91d78a] text-[#91d78a]" />
                ))}
              </div>
              <p
                className="text-sm text-[#c0c9bb] leading-relaxed flex-1 mb-5"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#41493e]">
                <div className="w-9 h-9 rounded-full bg-[#1b5e20]/40 border border-[#91d78a]/20 flex items-center justify-center shrink-0">
                  <span
                    className="text-xs font-bold text-[#91d78a]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-[#e5e2e1]"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[11px] text-[#8a9386]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App preview section ──────────────────────────────────────────────────────
function AppPreview() {
  return (
    <section className="py-24 bg-[#1c1b1b]/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge
              variant="outline"
              className="mb-6 border-[#41493e] text-[#91d78a] bg-[#1b5e20]/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1"
            >
              Mobile First
            </Badge>
            <h2
              className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#e5e2e1] tracking-tight mb-4"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Works on any Android phone
              <br />
              <span className="text-[#91d78a]">even in rural areas</span>
            </h2>
            <p
              className="text-[#8a9386] leading-relaxed mb-8"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Built for Ethiopian farmers. Our app works on basic Android phones,
              uses minimal data, and provides local language support in Afaan Oromo & Amharic.
            </p>

            <div className="space-y-4">
              {[
                { icon: Smartphone, title: "Works on any Android", desc: "Optimized for basic smartphones, even with limited storage." },
                { icon: Globe, title: "Local language support", desc: "Afaan Oromo & Amharic instructions for every farmer." },
                { icon: Zap, title: "3-second diagnosis", desc: "Instant AI results, no waiting, no experts needed." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-[0.75rem] bg-[#1b5e20]/20 border border-[#91d78a]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-[#91d78a]" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-[#e5e2e1] mb-0.5"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-sm text-[#8a9386]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center gap-4">
            <div className="w-40 mt-8">
              <ImgPlaceholder
                label="Disease detection screen"
                aspectRatio="aspect-[9/16]"
                className="w-full"
              />
            </div>
            <div className="w-40">
              <ImgPlaceholder
                label="Marketplace screen"
                aspectRatio="aspect-[9/16]"
                className="w-full"
              />
            </div>
            <div className="absolute inset-0 -z-10 bg-[#1b5e20]/10 blur-[60px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      desc: "Perfect for small-scale farmers starting out.",
      features: [
        "5 AI diagnoses / month",
        "Basic marketplace access",
        "Local language support",
        "Email support",
      ],
      cta: "Get started free",
      highlight: false,
    },
    {
      name: "Farmer",
      price: "299",
      period: "per month (ETB)",
      desc: "For serious farmers managing multiple crops.",
      features: [
        "Unlimited AI diagnoses",
        "Full marketplace access",
        "Verified seller badge",
        "Priority support",
        "Offline mode",
      ],
      cta: "Start free trial",
      highlight: true,
    },
    {
      name: "Cooperative",
      price: "Custom",
      period: "contact us",
      desc: "For agricultural cooperatives and NGOs.",
      features: [
        "Unlimited diagnoses",
        "Bulk purchasing discounts",
        "Agronomist support",
        "Training included",
        "Dedicated account manager",
      ],
      cta: "Contact us",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-[#41493e] text-[#91d78a] bg-[#1b5e20]/10 text-[10px] font-bold uppercase tracking-widest px-3 py-1"
          >
            Pricing
          </Badge>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-[#e5e2e1] tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Simple, transparent pricing
          </h2>
          <p
            className="mt-4 text-[#8a9386] text-base"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Start free. Upgrade when your farm grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-[1rem] p-6 border",
                plan.highlight
                  ? "bg-[#1b5e20]/20 border-[#91d78a]/40"
                  : "bg-[#1c1b1b] border-[#41493e]"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#91d78a] text-[#003909] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className="mb-5">
                <p
                  className="text-sm font-bold text-[#91d78a] uppercase tracking-widest mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-1">
                  {plan.price !== "Custom" && (
                    <span
                      className="text-4xl font-bold text-[#e5e2e1]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      {plan.price === "0" ? "Free" : `${plan.price}`}
                    </span>
                  )}
                  {plan.price === "Custom" && (
                    <span
                      className="text-3xl font-bold text-[#e5e2e1]"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Custom
                    </span>
                  )}
                  {plan.price !== "0" && plan.price !== "Custom" && (
                    <span
                      className="text-xs text-[#8a9386] mb-1.5"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      ETB/mo
                    </span>
                  )}
                </div>
                <p
                  className="text-sm text-[#8a9386]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#91d78a] shrink-0 mt-0.5" />
                    <span
                      className="text-sm text-[#c0c9bb]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.price === "Custom" ? "#contact" : "/signup"}>
                <Button
                  className={cn(
                    "w-full h-10 text-sm font-semibold rounded-[0.5rem] transition-all",
                    plan.highlight
                      ? "bg-[#91d78a] hover:bg-[#acf4a4] text-[#003909]"
                      : "bg-transparent border border-[#41493e] text-[#c0c9bb] hover:bg-[#201f1f] hover:border-[#8a9386] hover:text-[#e5e2e1]"
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA / Newsletter ─────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1b5e20]/10 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#1b5e20]/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 md:px-8 text-center">
        <h2
          className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-[#e5e2e1] tracking-tight mb-4"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Ready to transform
          <br />
          <span className="text-[#91d78a]">your farm?</span>
        </h2>
        <p
          className="text-[#8a9386] mb-8 leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Join 20,000+ farmers already using AgriTech One. Sign up free — no
          credit card needed. Get your first AI diagnosis in under 3 seconds.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-[#91d78a]">
            <CheckCircle2 className="w-5 h-5" />
            <span
              className="font-semibold"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              You're on the list! We'll be in touch.
            </span>
          </div>
        ) : (
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 rounded-[0.5rem] bg-[#1c1b1b] border-[#41493e] text-[#e5e2e1] placeholder:text-[#8a9386] focus-visible:ring-[#91d78a] focus-visible:border-[#91d78a] text-sm"
            />
            <Button
              onClick={() => email && setSubmitted(true)}
              className="h-12 px-6 text-sm font-semibold rounded-[0.5rem] bg-[#91d78a] hover:bg-[#acf4a4] text-[#003909] whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Join waitlist
            </Button>
          </div>
        )}

        <p
          className="text-xs text-[#41493e] mt-4"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Or{" "}
          <Link
            href="/signup"
            className="text-[#91d78a] hover:underline"
          >
            create your account now →
          </Link>
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#41493e] bg-[#0e0e0e]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-[0.5rem] bg-[#1b5e20] border border-[#91d78a]/30 flex items-center justify-center">
                <Sprout className="w-3.5 h-3.5 text-[#91d78a]" />
              </div>
              <span
                className="text-[#e5e2e1] font-bold text-sm"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                AgriTech One
              </span>
            </div>
            <p
              className="text-xs text-[#8a9386] leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Detect. Treat. Buy. Grow.
              <br />
              Smart crop diagnosis & verified marketplace for Ethiopian farmers.
            </p>
          </div>

          {[
            {
              heading: "Product",
              links: ["Features", "How it works", "Pricing", "Scanner"],
            },
            {
              heading: "Resources",
              links: ["Documentation", "API Reference", "Support", "Farmers Guide"],
            },
            {
              heading: "Company",
              links: ["About", "Blog", "Contact", "Careers"],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p
                className="text-xs font-bold uppercase tracking-widest text-[#8a9386] mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[#41493e] hover:text-[#91d78a] transition-colors"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#41493e] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-xs text-[#41493e]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            © 2026 AgriTech One · Bayisa Balcha Teka · BCS Software Engineering
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#91d78a] animate-pulse" />
            <span
              className="text-xs text-[#8a9386]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Detect → Treat → Buy → Grow
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <AppPreview />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
