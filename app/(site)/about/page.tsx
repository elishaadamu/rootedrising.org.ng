"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Target, 
  Heart, 
  Eye, 
  Send, 
  Camera, 
  Palette, 
  Users, 
  Scale, 
  ArrowRight 
} from "lucide-react";
import Hero from "@/components/common/Hero";
import TestimonialSlider from "@/components/about/TestimonialSlider";
import TeamSection from "@/components/about/TeamSection";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as any;

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <Hero 
        title="About Rooted Rising"
        subtitle="Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality. We are Rooted in Truth, Rising for Justice"
        backgroundImage="/images/about-us.jpg"
        scrollTarget="#about"
      />

      {/* Our Focus Area - 3 Card Grid */}
      <section id="focus" className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 square-grid opacity-20"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-brand-orange font-bold uppercase tracking-[0.2em] text-sm mb-4">Core Commitments</h2>
              <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Our <span className="header-highlight highlight-cyan text-slate-900">Focus</span>
              </h3>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Gender Justice",
                desc: "Amplifying voices of women and marginalized genders in frontline communities. We advocate for equal participation in decision-making and policies that address systemic inequalities.",
                icon: <Heart className="h-8 w-8" />,
                color: "text-rose-600 bg-rose-50"
              },
              {
                title: "Environment Justice",
                desc: "Advocating for communities in oil-sacrificed zones. We demand accountability from polluters and ensure a just transition that is inclusive of those most affected by environmental harm.",
                icon: <Scale className="h-8 w-8" />,
                color: "text-brand-navy bg-navy-50"
              },
              {
                title: "Society",
                desc: "Empowering communities to challenge systemic injustices. We co-create solutions that prioritize human and ecological well-being, building a foundation for true societal progress.",
                icon: <Users className="h-8 w-8" />,
                color: "text-emerald-600 bg-emerald-50"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-brand-orange transition-colors">{item.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Advocate Section - Light Theme Redesign */}
      <section id="advocacy" className="bg-white py-32 px-6 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-brand-cyan/5 blur-[120px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-brand-orange font-bold uppercase tracking-[0.2em] text-sm mb-6 flex items-center gap-4">
                <span className="h-0.5 w-12 bg-brand-orange"></span>
                Our Methodology
              </h2>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
                How We <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">Advocate</span>
              </h3>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:max-w-md lg:text-right"
            >
              <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 lg:border-l-0 lg:border-r-4 border-brand-orange pl-6 lg:pl-0 lg:pr-6">
                "We believe in the power of the media to make a change. At Rooted Rising, we leverage all forms of media communication to advocate for a better society."
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Storytelling",
                desc: "Capturing the raw, human essence of climate resilience through narrative-driven advocacy.",
                image: "/images/storytelling.png",
                color: "from-brand-orange/10 to-transparent",
                border: "border-brand-orange/10"
              },
              {
                title: "Content Creation",
                desc: "Producing high-impact digital media that bridges the gap between grassroots voices and global audiences.",
                image: "/images/video.png",
                color: "from-brand-cyan/10 to-transparent",
                border: "border-brand-cyan/10"
              },
              {
                title: "Artistic Impact",
                desc: "Using visual and performance arts as a universal language for environmental mobilization.",
                image: "/images/art.png",
                color: "from-brand-forest/10 to-transparent",
                border: "border-brand-forest/10"
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`group relative overflow-hidden rounded-[3rem] bg-slate-50 border ${card.border} p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-4`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="mb-10 relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-lg">
                    <Image 
                      src={card.image} 
                      alt={card.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-brand-orange transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-slate-600 text-lg leading-relaxed group-hover:text-slate-700 transition-colors font-medium">
                    {card.desc}
                  </p>
                </div>
                
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="text-brand-orange h-8 w-8" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSlider />
      <TeamSection />
    </div>
  );
}
