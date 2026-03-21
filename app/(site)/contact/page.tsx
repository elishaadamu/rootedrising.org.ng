"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, Send, MessageCircle } from "lucide-react";
import Hero from "@/components/common/Hero";

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6 text-brand-cyan" />,
    label: "Email Us",
    value: "info@rootedrising.org.ng",
    href: "mailto:info@rootedrising.org.ng"
  },
  {
    icon: <Phone className="h-6 w-6 text-brand-teal" />,
    label: "Call or WhatsApp",
    value: "+234 (0) 706 821 2022",
    href: "tel:+2347068212022"
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Hero 
        title="Get in Touch"
        subtitle="Have questions about our programs or want to partner with us? Our team is ready to scale global goals locally with you."
        backgroundImage="/images/volunteers.jpg"
        scrollTarget="#contact-form"
      />

      <section id="contact-form" className="section-padding bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-extrabold mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                    <input type="text" className="w-full bg-slate-50 rounded-2xl border border-slate-200 px-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                    <input type="email" className="w-full bg-slate-50 rounded-2xl border border-slate-200 px-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Subject</label>
                  <select className="w-full bg-slate-50 rounded-2xl border border-slate-200 px-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all">
                    <option>General Inquiry</option>
                    <option>Partnership Proposal</option>
                    <option>Ambassador Program</option>
                    <option>Volunteer Interest</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Your Message</label>
                  <textarea className="w-full bg-slate-50 rounded-2xl border border-slate-200 px-6 py-4 focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all min-h-[160px]" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full rounded-2xl bg-brand-forest px-8 py-5 text-lg font-bold text-white shadow-xl shadow-forest-500/10 transition-all hover:bg-brand-dark hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12 bg-slate-50 p-12 rounded-[3rem] shadow-sm border border-slate-100"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-8">
                  {contactMethods.map((method, i) => (
                    <a key={i} href={method.href} className="group flex items-start gap-6 p-1 rounded-3xl transition-all">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:scale-110">
                        {method.icon}
                      </div>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{method.label}</span>
                        <span className="text-lg font-bold text-slate-800 transition-colors group-hover:text-brand-forest leading-none">{method.value}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-slate-200 space-y-8">
                <h3 className="text-2xl font-bold">Partner with Us</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  We are open to partnerships with global organizations, research institutions, and local leaders who share our vision for building climate resilience through co-creation and technology.
                </p>
                <div className="flex gap-4">
                    <a 
                      href="https://wa.me/2347068212022"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-teal transition-all group"
                    >
                        <MessageCircle size={32} className="text-brand-teal group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">WhatsApp Chat</span>
                    </a>
                    <a 
                      href="mailto:info@rootedrising.org.ng"
                      className="flex-1 flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-forest transition-all group"
                    >
                        <Mail size={32} className="text-brand-forest group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Send Email</span>
                    </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
