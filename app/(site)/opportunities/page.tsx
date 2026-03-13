"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  Download,
  Terminal,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import Hero from "@/components/common/Hero";
import CTA from "@/components/common/CTA";

const timelineSteps = [
  { step: 1, title: "Expression of Interest", date: "Month 1", desc: "Submit your details through our online portal." },
  { step: 2, title: "Initial Screening", date: "Month 1", desc: "Our team reviews eligibility and passion for climate action." },
  { step: 3, title: "Interview Phase", date: "Month 2", desc: "Shortlisted candidates are invited for a digital interview." },
  { step: 4, title: "Induction Program", date: "Month 2", desc: "Onboarding and orientation into the REACT ecosystem." },
  { step: 5, title: "Capacity Building", date: "Months 3-5", desc: "Intensive training in climate tech and leadership." },
  { step: 6, title: "Field Implementation", date: "Months 6-10", desc: "Leading local projects under expert mentorship." },
  { step: 7, title: "Impact Assessment", date: "Month 11", desc: "Evaluating project outcomes and personal growth." },
  { step: 8, title: "Graduation", date: "Month 12", desc: "Joining our global alumni network of climate leaders." }
];

const pillars = [
  { title: "Environmental Leadership", icon: <CheckCircle2 className="text-brand-cyan shrink-0" /> },
  { title: "Climate Advocacy", icon: <CheckCircle2 className="text-brand-forest shrink-0" /> },
  { title: "Digital Literacy & Tech", icon: <CheckCircle2 className="text-brand-teal shrink-0" /> },
  { title: "Local Innovation", icon: <CheckCircle2 className="text-brand-dark shrink-0" /> }
];

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero 
        title="REACT Ambassador Programme"
        subtitle="Empowering the next generation of climate leaders to build resilience and lead grassroots innovation in rural communities."
        backgroundImage="/images/gallery/IMG_2022.JPG"
        height="full"
        titleSize="xl"
        scrollTarget="#overview"
      >
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link href="#apply" className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-brand-forest transition-all hover:bg-slate-100 hover:shadow-xl sm:w-auto active:scale-95">
                Apply Now | Join the Movement
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#" className="flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto">
                Download ToR (PDF)
                <Download size={20} />
            </Link>
        </div>
      </Hero>

      {/* Overview Section */}
      <section id="overview" className="section-padding bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-brand-forest font-bold uppercase tracking-widest text-sm mb-4">Programme Overview</h2>
              <h3 className="text-4xl font-extrabold mb-8 text-slate-900 leading-tight">A 12-Month Journey into <span className="header-highlight highlight-yellow text-slate-800">Climate Excellence</span></h3>
              <p className="text-xl text-slate-600 leading-relaxed mb-10 font-medium">
                The REACT Ambassador Programme is designed to identify, train, and support young leaders who are passionate about scaling climate solutions in their local contexts.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                    { icon: <Calendar className="text-brand-forest" />, label: "Duration", value: "12 Months (Part-time)" },
                    { icon: <MapPin className="text-brand-cyan" />, label: "Location", value: "Rural Hubs (Flexible)" },
                    { icon: <Clock className="text-brand-teal" />, label: "Frequency", value: "10-15 Hours per week" },
                    { icon: <FileText className="text-brand-dark" />, label: "Certificate", value: "Available on Graduation" }
                ].map((info, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                            {info.icon}
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{info.label}</span>
                            <span className="text-sm font-bold text-slate-800">{info.value}</span>
                        </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
                <h4 className="text-2xl font-bold mb-8">What you will gain</h4>
                <ul className="space-y-6">
                    {[
                        "Leadership & Advocacy Certification",
                        "Practical experience in climate-smart agriculture",
                        "Networking with global climate organizations",
                        "Data-driven decision-making expertise",
                        "Opportunity to lead impactful grassroots projects",
                        "Ongoing mentorship from industry experts"
                    ].map((benefit, b) => (
                        <li key={b} className="flex gap-4 items-center group/item transition-all hover:translate-x-2">
                            <div className="h-2 w-2 rounded-full bg-brand-cyan group-hover/item:scale-150 transition-transform"></div>
                            <span className="text-lg text-slate-300 group-hover/item:text-white transition-colors">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Thematics Section */}
      <section className="section-padding bg-slate-50">
          <div className="mx-auto max-w-7xl text-center">
                <h2 className="text-brand-cyan font-bold uppercase tracking-widest text-sm mb-4">Programme Focus</h2>
                <h3 className="text-4xl font-extrabold mb-16 text-slate-900 leading-tight">Key <span className="header-highlight highlight-teal">Focus & Specialization</span></h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm transition-all hover:shadow-2xl hover:border-brand-forest border-2 border-transparent group">
                            <div className="flex h-16 w-16 mb-8 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-brand-forest transition-colors text-brand-forest group-hover:text-white">
                                {pillar.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand-forest transition-colors">{pillar.title}</h4>
                        </div>
                    ))}
                </div>
          </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-bold text-3xl mb-24 uppercase tracking-tight"><span className="header-highlight highlight-cyan">Application Timeline & Process</span></h2>
            <div className="relative">
                {/* Connector line */}
                <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-slate-100 hidden md:block"></div>
                
                <div className="space-y-16">
                    {timelineSteps.map((step, s) => (
                        <motion.div 
                            key={s}
                            initial={{ opacity: 0, x: s % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className={cn(
                                "relative flex flex-col md:flex-row items-center gap-12",
                                s % 2 === 0 ? "md:flex-row-reverse" : ""
                            )}
                        >
                            <div className="md:w-1/2 px-6 text-center md:text-left">
                                <span className="inline-block text-brand-forest font-bold mb-2 uppercase text-xs tracking-widest">{step.date}</span>
                                <h4 className={cn("text-2xl font-bold mb-4", s % 2 === 0 ? "md:text-right" : "")}>{step.title}</h4>
                                <p className={cn("text-slate-600 text-lg leading-relaxed", s % 2 === 0 ? "md:text-right" : "")}>{step.desc}</p>
                            </div>
                            
                            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-forest text-white hidden md:flex items-center justify-center font-bold z-10 shadow-xl border-4 border-white">
                                {step.step}
                            </div>
                            
                            <div className="md:w-1/2 min-h-24 hidden md:block"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Application Form Placeholder / CTA */}
      <section id="apply" className="section-padding bg-slate-900 relative">
          <div className="mx-auto max-w-5xl text-center text-white relative z-10">
              <Terminal className="mx-auto h-16 w-16 mb-8 text-brand-cyan" />
              <h2 className="text-4xl font-extrabold mb-8 uppercase tracking-tight"><span className="header-highlight highlight-yellow text-slate-900">Register your interest</span></h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                Ready to take the first step towards impact? Submit your preliminary application today. We are looking for passion, vision, and a commitment to rural leadership.
              </p>
              <div className="inline-block glass-card p-10 rounded-3xl border-none">
                <Link href="#" className="flex h-20 items-center justify-center rounded-2xl bg-brand-cyan text-slate-900 font-black text-2xl px-16 shadow-2xl transition-all hover:bg-white hover:text-brand-forest hover:-translate-y-2 uppercase tracking-wide">
                    Start Application
                </Link>
              </div>
          </div>
      </section>

      <CTA 
        title="Still have questions?"
        subtitle="Download our full Information Pack or talk to one of our ambassadors."
        primaryButtonText="Download Info Pack"
        primaryButtonHref="#"
        secondaryButtonText="Chat with us"
        secondaryButtonHref="/contact"
        theme="sky"
      />
    </div>
  );
}
