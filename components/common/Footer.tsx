"use client";

import Link from "next/link";
import { 
  Globe, 
  Mail, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook,
  ArrowRight,
  Phone,
  Loader2,
  Send,
  Youtube
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { subscribeNewsletter } from "@/lib/actions/newsletter";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const footerLinks = {
  navigation: [
    { name: "Home", href: "/" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Artvocacy", href: "/artvocacy" },
    { name: "About Us", href: "/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
  ],
  pillars: [
    { name: "Agriculture", href: "#" },
    { name: "Ecosystems", href: "#" },
    { name: "Clean Energy", href: "#" },
    { name: "Climate Tech", href: "#" },
    { name: "Youth Leadership", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Settings", href: "#" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: <Linkedin size={18} />, href: "https://www.linkedin.com/company/rooted-rising-initiative/" },
  { name: "Instagram", icon: <Instagram size={18} />, href: "https://www.instagram.com/rootedrising1/" },
  { name: "YouTube", icon: <Youtube size={18} />, href: "https://www.youtube.com/@rootedrising" },
  { name: "TikTok", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>, href: "https://www.tiktok.com/@rootedrising?_t=ZM-8uA4DeB6J89&_r=1" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const result = await subscribeNewsletter(formData);
      if (result.success) {
        toast.success("Welcome aboard!", {
          description: "You've successfully subscribed to Rooted Rising perspectives."
        });
        setEmail("");
      } else {
        toast.error("Subscription failed", {
          description: result.error || "Please try again later."
        });
      }
    });
  };

  return (
    <footer className="bg-black pt-20 pb-12 text-slate-300 overflow-hidden relative border-t border-white/5">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 3px, transparent 3px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-cyan via-brand-forest to-brand-dark opacity-10"></div>
      
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        {/* Newsletter Section - Now at the Top */}
        <div className="mb-16 py-10 px-8 rounded-4xl bg-white/5 border border-white/5 backdrop-blur-sm max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight uppercase">
            Join Our Newsletter
          </h2>
          <p className="text-slate-400 font-medium text-sm mb-8">
            Get stories for action and advocacy updates delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-3 text-sm font-bold text-white outline-none focus:border-brand-orange transition-all placeholder:text-slate-500"
                required
              />
              <button 
                type="submit"
                disabled={isPending || !email}
                className="sm:px-6 py-3 bg-brand-orange hover:bg-white rounded-xl text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <>Subscribe</>}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Info */}
          <div className="col-span-1">
            <Link href="/" className="mb-8 flex items-center group">
              <div className="relative h-20 w-16 overflow-hidden rounded-xl transition-transform hover:scale-110">
                <Image
                  src="/images/logo.png"
                  alt="Rooted Rising Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="ml-4">
                <span className="block text-3xl font-black tracking-tight text-white leading-none">Rooted Rising</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mt-1 block leading-tight">Development Media Initiative</span>
              </div>
            </Link>
            <p className="mb-10 text-base leading-relaxed text-slate-400 max-w-xs">
              Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/50 text-slate-400 transition-all hover:bg-brand-forest hover:text-white hover:-translate-y-1 shadow-lg"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Site Navigation */}
          <div className="lg:pl-12">
            <h3 className="mb-8 font-bold text-white uppercase tracking-widest text-xs">Explore</h3>
            <ul className="space-y-4">
              {footerLinks.navigation.map((linkItem) => (
                <li key={linkItem.name}>
                  <Link href={linkItem.href} className="text-base font-medium transition-colors hover:text-brand-cyan hover:pl-2 inline-flex items-center gap-3 group">
                    <span className="h-1.5 w-1.5 bg-brand-cyan rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {linkItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:pl-12">
            <h3 className="mb-8 font-bold text-white uppercase tracking-widest text-xs">Reach Out</h3>
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800/50 text-brand-cyan shadow-lg">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Email</span>
                  <Link href="mailto:info@rootedrising.org.ng" className="text-base font-semibold hover:text-white transition-colors">info@rootedrising.org.ng</Link>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800/50 text-brand-cyan shadow-lg">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Phone</span>
                  <Link href="tel:+2347068212022" className="text-base font-semibold hover:text-white transition-colors">+234 (0) 706 821 2022</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-8 pt-12 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              © {new Date().getFullYear()} Rooted Rising Initiative. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs text-slate-500 font-medium">
              {footerLinks.legal.map((item) => (
                <Link key={item.name} href={item.href} className="hover:text-white transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
