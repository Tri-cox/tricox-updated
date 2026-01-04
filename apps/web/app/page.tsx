"use client";
import React, { useRef } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { ArrowRight, Package, Terminal, Zap, Shield, Globe, Box, Check, Star, Code2, Cloud, Download } from 'lucide-react';
import Link from 'next/link';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const container = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline();

    tl.from(".hero-text", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    })
      .fromTo(terminalRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=0.5"
      );

    // Background Blob Animation
    gsap.to(".blob", {
      y: "30px",
      rotation: 10,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Scroll Animations for Sections
    const sections = gsap.utils.toArray('.anim-section');
    sections.forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-300">
      <PublicNavbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="blob absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] -z-10" />
        <div className="blob absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -z-10 animation-delay-2000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0 is now live
          </div>

          <h1 className="hero-text text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The Component Registry for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Modern Developers
            </span>
          </h1>

          <p className="hero-text max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
            Ship components from your command line. Dock them anywhere.
            Build faster with a decentralized, CLI-first component workflow.
          </p>

          <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20">
              Start Shipping
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white text-lg font-medium rounded-full border border-white/10 backdrop-blur-sm font-mono flex items-center justify-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">
              <Terminal className="w-5 h-5 text-gray-400" />
              npm install -g @tricox/cli
            </div>
          </div>

          {/* Code Preview */}
          <div ref={terminalRef} className="mt-20 w-full max-w-4xl bg-[#0d1117] rounded-xl border border-white/10 shadow-2xl overflow-hidden text-left relative group hover:border-indigo-500/30 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-500 font-mono">terminal — tricox</span>
            </div>
            <div className="p-6 font-mono text-sm sm:text-base leading-relaxed">
              <div className="flex gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">tricox ship ./src/Button.tsx --public</span>
              </div>
              <div className="text-gray-500 mt-2">
                Parsing AST... Verified dependencies.<br />
                <span className="text-indigo-400">ℹ</span> Found imports: 'clsx', 'tailwind-merge'<br />
                🚀 component shipped to <span className="text-green-400 underline decoration-dashed underline-offset-4">@chirag/Button</span>
              </div>
              <div className="flex gap-2 mt-6">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">tricox dock @chirag/Button</span>
              </div>
              <div className="text-gray-500 mt-2">
                Downloading... Installed dependencies.<br />
                ✅ Copied to <span className="text-yellow-300">./src/components/Button.tsx</span>
              </div>
              <div className="mt-4 animate-pulse text-gray-600">_</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos (Text for now to keep it simple but clean) */}
            <span className="text-xl font-bold text-white">ACME Corp</span>
            <span className="text-xl font-bold text-white">Globex</span>
            <span className="text-xl font-bold text-white">Soylent</span>
            <span className="text-xl font-bold text-white">Initech</span>
            <span className="text-xl font-bold text-white">Umbrella</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 anim-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Stop copy-pasting code from old projects. Tricox streamlines your component workflow in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -z-10 bg-[length:20px_100%]"></div>

            {/* Step 1 */}
            <div className="relative group text-center">
              <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:border-indigo-500 transition-colors shadow-xl">
                <Code2 className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">1. Ship</h3>
              <p className="text-gray-400 leading-relaxed">
                Run <code>tricox ship</code> in your terminal. We parse your component, handle dependencies, and upload it securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative group text-center">
              <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-500 transition-colors shadow-xl">
                <Cloud className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">2. Store</h3>
              <p className="text-gray-400 leading-relaxed">
                Your components are versioned and stored in the registry. Manage access, view preview, and organize by teams.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative group text-center">
              <div className="w-24 h-24 mx-auto bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:border-pink-500 transition-colors shadow-xl">
                <Download className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">3. Dock</h3>
              <p className="text-gray-400 leading-relaxed">
                In any other project, run <code>tricox dock</code>. The component is downloaded directly into your source folder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/5 anim-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Power Tools for Frontend Teams</h2>
            <p className="text-gray-400">Everything you need to maintain a high-quality component library.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Terminal className="w-6 h-6 text-indigo-400" />}
              title="CLI First"
              desc="Native command line experience. Ship and dock without leaving your terminal."
            />
            <FeatureCard
              icon={<Box className="w-6 h-6 text-purple-400" />}
              title="Zero Config"
              desc="Automatic dependency detection. No complex configuration files needed."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-pink-400" />}
              title="Public & Private"
              desc="Share with the world or keep internal components secure within your org."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Instant Updates"
              desc="Version control built-in. Update components across projects in one command."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-cyan-400" />}
              title="Secure by Default"
              desc="Enterprise-grade security. Token-based authentication and role management."
            />
            <FeatureCard
              icon={<Package className="w-6 h-6 text-green-400" />}
              title="Framework Agnostic"
              desc="Works with React, Vue, Svelte, or vanilla JS. You control the code."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 anim-section border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-16">Loved by Engineers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Tricox completely changed how we share UI components between our marketing site and product app. It's like npm but for source code."
              author="Alex Rivera"
              role="Senior Frontend Dev"
            />
            <TestimonialCard
              quote="The CLI is blazingly fast. I can ship a fixed component and have my team dock the update in seconds. Zero friction."
              author="Sarah Chen"
              role="Tech Lead @ FinTech"
            />
            <TestimonialCard
              quote="Finally, a registry that doesn't force me to package everything. I just want to share a Button component, not maintain a library."
              author="James Wilson"
              role="Indie Hacker"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 anim-section">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black rounded-3xl p-12 md:p-20 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 relative z-10">Ready to accelerate your workflow?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of developers shipping better software, faster. Start for free today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/signup" className="px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                Get Started for Free
              </Link>
              <Link href="/dashboard/docs" className="px-10 py-5 bg-white/10 text-white text-xl font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all">
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TRICOX</span>
            </div>
            <p className="text-gray-500 text-sm">
              The component registry for modern developers. Ship, store, and dock UI components with ease.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-500">Features</a></li>
              <li><a href="#" className="hover:text-indigo-500">CLI</a></li>
              <li><a href="#" className="hover:text-indigo-500">Registry</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/dashboard/docs" className="hover:text-indigo-500">Documentation</Link></li>
              <li><a href="#" className="hover:text-indigo-500">API</a></li>
              <li><a href="#" className="hover:text-indigo-500">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-500">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-500">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/10">
          <p>© 2026 Tricox Registry. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:bg-white/10 transition-all group">
      <div className="mb-4 bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 relative">
      <div className="absolute top-6 right-6 text-indigo-900/40">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.0547 15.372 15.5547 16.394 15.5547C16.8915 15.5547 17.2985 15.5023 17.5118 15.4211C18.232 15.1504 19.0526 14.4754 19.0526 12.7215C19.0526 11.2367 17.7719 11.2367 17.7719 11.2367C16.3533 11.2367 15.2033 12.3867 15.2033 13.8867L15.2033 14L12.0305 14L12.0305 10C12.0305 5.5 15.2033 3 19.4638 3L20.4638 3L20.4638 5.66667C16.7466 5.66667 15.7573 7.828 15.6573 8.35533C17.0601 8.27133 19.0754 8.76933 19.9674 10.334C20.6548 11.5393 21 12.9807 21 14.5453C21 18.064 18.2705 21 14.8624 21L14.017 21ZM5.01662 21L5.01662 18C5.01662 16.0547 6.37199 15.5547 7.394 15.5547C7.89153 15.5547 8.29853 15.5023 8.51177 15.4211C9.23199 15.1504 10.0526 14.4754 10.0526 12.7215C10.0526 11.2367 8.77195 11.2367 8.77195 11.2367C7.35332 11.2367 6.20332 12.3867 6.20332 13.8867L6.20332 14L3.03049 14L3.03049 10C3.03049 5.5 6.20332 3 10.4638 3L11.4638 3L11.4638 5.66667C7.74662 5.66667 6.75732 7.828 6.65732 8.35533C8.06008 8.27133 10.0754 8.76933 10.9674 10.334C11.6548 11.5393 12 12.9807 12 14.5453C12 18.064 9.27052 21 5.86239 21L5.01662 21Z" />
        </svg>
      </div>
      <div className="flex items-center gap-1 mb-4 text-yellow-400">
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
        <Star className="w-4 h-4 fill-current" />
      </div>
      <p className="text-gray-300 mb-6 italic relative z-10">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center font-bold text-gray-300">
          {author[0]}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{author}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
