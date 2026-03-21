"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Send, 
  Camera, 
  Palette, 
  Heart, 
  Users, 
  Scale,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroCarousel from "@/components/common/HeroCarousel";
import CTA from "@/components/common/CTA";
import { BlogSection, BlogCard } from "@/components/blog/BlogComponents";
import GallerySection from "@/components/home/GallerySection";
import TestimonialSlider from "@/components/about/TestimonialSlider";
import TeamSection from "@/components/about/TeamSection";
import VideoCard from "@/components/common/VideoCard";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
} as any;

export default function HomeClient({ 
  blogPosts, 
  campaignPosts,
  videos = []
}: { 
  blogPosts: any[]; 
  campaignPosts: any[]; 
  videos?: any[];
}) {
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0` : url;
  };

  const fallbackVideos = [
    { title: "Oil Extraction and Water Pollution", link: "https://www.youtube.com/embed/dy-baZfnC-c?si=qi38nrQ_swvxAdXY" },
    { title: "16 Days of Activism (Gender Based Violence)", link: "https://www.youtube.com/embed/veRrjFfKugY?si=MZAzTTV2Da0ct0WY" },
    { title: "What is Climate Change?", link: "https://www.youtube.com/embed/7UMDpY263y8?si=tmghp3cmx9MEi-YB" }
  ];

  const displayVideos = videos.length >= 3 ? videos : [...videos, ...fallbackVideos.slice(videos.length)];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroCarousel 
        slides={[
          {
            title: "",
            subtitle: "",
            backgroundImage: "/images/1.png"
          },
          {
            title: "",
            subtitle: "",
            backgroundImage: "/images/2.png"
          },
          {
            title: "",
            subtitle: "",
            backgroundImage: "/images/3.png"
          }
        ]}
        height="banner"
        titleSize="xl"
        scrollTarget="#about-us"
        intervalMs={6000}
      >
        {/* Buttons removed */}
      </HeroCarousel>

      {/* About Section - Brief */}
      <section id="about-us" className="section-padding bg-white relative overflow-hidden">
        {/* Decorative Leaf 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotate: -20 }}
          whileInView={{ opacity: 0.6, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -left-12 top-20 z-0 h-48 w-48 opacity-40 pointer-events-none"
        >
          <Image src="/images/leaf-1.png" alt="" fill className="object-contain" />
        </motion.div>

        {/* Decorative Leaf 2 */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotate: 20 }}
          whileInView={{ opacity: 0.6, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute -right-20 bottom-10 z-0 h-64 w-64 opacity-40 pointer-events-none"
        >
          <Image src="/images/leaf-2.png" alt="" fill className="object-contain rotate-45" />
        </motion.div>

        <div aria-hidden="true" className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl opacity-50"></div>
        <div aria-hidden="true" className="absolute top-1/2 left-0 -ml-24 h-64 w-64 rounded-full bg-brand-navy/10 blur-3xl opacity-30"></div>
        
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-teal flex items-center gap-2">
                <span className="h-0.5 w-8 bg-brand-teal"></span>
                Introduction
              </h2>
              <h3 className="mb-8 text-3xl font-extrabold leading-[1.2] text-slate-900 md:text-5xl">
                Rooted in Truth, <br />
                <span className="header-highlight highlight-cyan text-brand-navy">Rising for Justice</span>
              </h3>
              
              <div className="space-y-6 text-xl leading-relaxed text-slate-700 font-medium">
                <p>
                  Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality.
                </p>
                <p className="text-brand-orange font-bold text-2xl italic border-l-4 border-brand-orange pl-6">
                  "We are Rooted in Truth, Rising for Justice."
                </p>
              </div>
              
              <Link href="/about" className="mt-10 inline-flex items-center gap-2 font-bold text-brand-forest hover:gap-3 transition-all">
                Learn more about our journey <ArrowRight size={18} />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image 
                src="/images/about-1.png" 
                alt="Rooted Rising Advocacy" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-dark/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl border-white/40 shadow-2xl">
                <p className="text-brand-dark font-bold quote text-lg leading-snug">
                  "Working with communities <br/> <span className="text-brand-forest">rather than for them.</span>"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campaigns Section - New */}
      <section id="campaigns" className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 square-grid opacity-30"></div>
        <div className="mx-auto max-w-7xl relative z-10 px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="max-w-2xl"
            >
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">Voices from the field</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight leading-tight">
                Voice of the <span className="header-highlight highlight-cyan text-brand-navy">Frontline</span>
              </h3>
            </motion.div>
            
            <Link 
              href="/campaigns" 
              className="group inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-orange hover:shadow-lg active:scale-95"
            >
              View all Campaigns
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {displayVideos.map((video, idx) => (
              <VideoCard 
                key={idx}
                title={video.title}
                videoUrl={video.url || video.link}
                index={idx}
                variant="white"
                aspect="square"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="our-pillars" className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 square-grid opacity-60"></div>
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="mb-20"
          >
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">Core Commitments</h2>
            <h3 className="mb-6 text-3xl font-extrabold text-slate-900 md:text-6xl tracking-tight leading-tight">
              Our <span className="header-highlight highlight-cyan text-brand-navy">Focus</span>
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 font-medium">
              We leverage the intersection of media, art, and community mobilization to drive systemic change for our planet and its people.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Gender Justice",
                desc: "Amplifying voices of women and marginalized genders in frontline communities. We advocate for equal participation in decision-making and policies that address systemic inequalities.",
                icon: <Heart className="h-8 w-8" />,
                color: "bg-rose-50 text-rose-600"
              },
              {
                title: "Environment Justice",
                desc: "Advocating for communities in oil-sacrificed zones. We demand accountability from polluters and ensure a just transition that is inclusive of those most affected by environmental harm.",
                icon: <Scale className="h-8 w-8" />,
                color: "bg-navy-50 text-brand-navy"
              },
              {
                title: "Society",
                desc: "Empowering communities to challenge systemic injustices. We co-create solutions that prioritize human and ecological well-being, building a foundation for true societal progress.",
                icon: <Users className="h-8 w-8" />,
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
                }}
                className="group relative overflow-hidden bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:border-gray active:scale-[0.98]"
              >
                {/* Background Accent */}
                <div className={cn("absolute top-0 right-0 h-40 w-40 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl rounded-full translate-x-1/2 -translate-y-1/2", pillar.color.split(' ')[0])}></div>
                
                <div className={cn("mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg", pillar.color)}>
                  {pillar.icon}
                </div>
                
                <h4 className="mb-4 text-2xl font-black text-slate-900 group-hover:text-brand-forest transition-colors leading-tight">{pillar.title}</h4>
                <p className="text-slate-600 text-[1.05rem] leading-relaxed font-medium mb-4 relative z-10">{pillar.desc}</p>
                
                {/* Card Icon Accent Bottom Right */}
                <div className={cn("absolute bottom-16 right-16 opacity-[0.06] scale-[6] transform transition-transform duration-1000 group-hover:scale-[10] group-hover:rotate-12", pillar.color.split(' ')[1])}>
                   {pillar.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>
 
          {/* Campaign Posts Grid under Our Focus */}
          {campaignPosts.length > 0 && (
            <div className="mt-20">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="text-left">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-forest mb-2">Ongoing Advocacy</h4>
                  <h5 className="text-2xl font-black text-slate-900">Latest <span className="header-highlight highlight-yellow">Campaigns</span></h5>
                </div>
                <Link 
                  href="/campaigns/all" 
                  className="group inline-flex items-center gap-2 font-bold text-brand-forest hover:gap-3 transition-all"
                >
                  Explore all campaigns <ArrowRight size={18} />
                </Link>
              </div>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 text-left">
                {campaignPosts.map((post, idx) => (
                  <BlogCard key={post.slug} post={post} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* Approach Section */}
      <section id="approach" className="section-padding bg-black/95 backdrop-blur-xl border border-white/10  text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 square-grid opacity-10"></div>
        <div aria-hidden="true" className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[500px] w-[500px] rounded-full bg-brand-cyan/20 blur-3xl opacity-40"></div>
        <div aria-hidden="true" className="absolute top-0 right-0 -mr-32 -mt-32 h-[500px] w-[500px] rounded-full bg-brand-forest/10 blur-3xl opacity-20"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-4/5 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,173,239,0.15)] border border-white/10"
            >
              <Image 
                src="/images/about-2.png" 
                alt="Farmer using technology" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange flex items-center gap-3">
                <span className="h-0.5 w-10 bg-brand-orange"></span>
                Volunteer with us
              </h2>
              <h3 className="mb-8 text-4xl font-extrabold leading-[1.2] md:text-5xl text-white">
                Building a Just, Inclusive, and <br/>
                <span className="header-highlight highlight-cyan text-white">Sustainable Society</span>
              </h3>
              
              <div className="space-y-8 text-xl text-slate-300 leading-relaxed font-medium">
                <p>
                  The Rooted Rising Initiative seeks to address the environmental and socio-economic challenges faced in the world. It aims to build a just, inclusive, and sustainable society where everyone can thrive and achieve self-actualization.
                </p>

                <div className="bg-white/5 border-l-4 border-brand-orange p-8 rounded-r-3xl backdrop-blur-sm">
                  <h4 className="text-white text-2xl font-bold mb-4 italic">Our Mission</h4>
                  <p className="text-slate-200 text-lg">
                    Our mission is to ignite awareness, change narratives, educate, and inspire action among all stakeholders through various means, such as podcasts, multimedia stories, and community engagement. We aim to address the pressing issues affecting the world by promoting environmental conservation, socio-economic development, and community resilience.
                  </p>
                  <div className="mt-8">
                    <Link 
                      href="https://forms.gle/mkGvsk2jL9BqGSdX8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-lg"
                    >
                      Apply Now
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <TeamSection />
      <TestimonialSlider />
      {/* Blog Section */}
      <BlogSection posts={blogPosts} />

      <CTA 
        title="Ready to make an impact?"
        subtitle="Join our network of ambassadors, partners, and community leaders. Together, we can build a resilient future."
        primaryButtonText="Join the Movement"
        primaryButtonHref="https://forms.gle/mkGvsk2jL9BqGSdX8"
        secondaryButtonText="Work with Us"
        secondaryButtonHref="/contact"
      />
    </div>
  );
}
