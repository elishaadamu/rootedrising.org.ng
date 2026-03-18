"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, Mail, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTeamMembers } from "@/lib/actions/team";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  email?: string | null;
}

const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full bg-white rounded-4xl p-8 border border-slate-200 transition-all duration-500 flex flex-col items-center text-center shadow-xs"
    >
      {/* Floating Circular Avatar */}
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 mb-6 rounded-full overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-500">
        <Image 
          src={member.image || "/images/gallery/IMG_2006.JPG"} 
          alt={member.name} 
          fill 
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 transition-colors uppercase tracking-tight">{member.name}</h4>
        <p className="text-xs sm:text-sm font-semibold text-indigo-600/90 tracking-wide">{member.role}</p>
        <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed line-clamp-4 pt-3 px-1 font-medium">
          {member.bio}
        </p>
      </div>

      {/* Social Icons at bottom */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6 text-slate-400">
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
            <Linkedin size={18} strokeWidth={1.5} />
          </a>
        )}
        {member.facebook && (
          <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
            <Facebook size={18} strokeWidth={1.5} />
          </a>
        )}
        {member.instagram && (
          <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} className="hover:text-slate-900 transition-colors">
            <Mail size={18} strokeWidth={1.5} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1); 
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      const result = await getTeamMembers();
      if (result.success && result.data) {
        setTeam(result.data as TeamMember[]);
      } else {
        setTeam([]);
      }
      setIsLoading(false);
    };
    fetchTeam();
  }, []);

  const nextSlide = useCallback(() => {
    if (team.length <= visibleItems) return;
    setCurrentIndex((prev) => (prev + 1 > team.length - visibleItems ? 0 : prev + 1));
  }, [team.length, visibleItems]);

  const prevSlide = () => {
    if (team.length <= visibleItems) return;
    setCurrentIndex((prev) => (prev - 1 < 0 ? team.length - visibleItems : prev - 1));
  };

  useEffect(() => {
    if (isPaused || isLoading || team.length <= visibleItems) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoading, isPaused, nextSlide, team.length, visibleItems]);

  if (isLoading) return <div className="h-96 flex items-center justify-center">Loading Team...</div>;

  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div aria-hidden="true" className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand-cyan/5 blur-3xl opacity-50"></div>
      <div aria-hidden="true" className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-brand-forest/5 blur-3xl opacity-50"></div>
      
      <div className="container mx-auto relative z-10 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-teal">Our Leadership</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 md:text-5xl lg:text-6xl mb-6 tracking-tight">
              The Minds Behind <span className="header-highlight highlight-yellow text-slate-900">Rooted Rising Initiative</span>
            </h3>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Meet the dedicated team driving sustainable change and climate resilience across underserved communities.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Play carousel" : "Pause carousel"}
              className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-forest hover:border-brand-forest transition-all"
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
            </button>
            <div className="hidden sm:flex gap-3">
              <button 
                onClick={prevSlide}
                aria-label="Previous slide"
                className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-forest hover:border-brand-forest transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                aria-label="Next slide"
                className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-forest hover:border-brand-forest transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `-${currentIndex * (100 / visibleItems)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${(team.length / visibleItems) * 100}%` }}
          >
            {team.map((member, j) => (
              <div 
                key={member.id || j} 
                style={{ width: `${100 / team.length}%` }}
                className="px-2"
              >
                <TeamCard member={member} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slider Indicators */}
        <div className="flex justify-center items-center gap-1 mt-20">
           {Array.from({ length: Math.max(0, team.length - visibleItems + 1) }).map((_, i) => (
             <button 
               key={i} 
               onClick={() => setCurrentIndex(i)}
               className="group flex h-10 min-w-10 items-center justify-center p-2"
               aria-label={`Go to slide ${i + 1}`}
             >
                <div className={`transition-all duration-500 rounded-full ${
                  i === currentIndex 
                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-brand-forest shadow-[0_0_10px_rgba(21,128,61,0.2)]' 
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-200 group-hover:bg-slate-300'
                }`} />
             </button>
           ))}
        </div>
      </div>
    </section>
  );
}
