import { Metadata } from "next";
import Hero from "@/components/common/Hero";
import { getArtvocacies } from "@/lib/actions/artvocacy";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Artvocacy | Rooted Rising Development Media Initiative",
  description: "Explore the intersection of art and advocacy. Our Artvocacy initiatives use visual storytelling and creative expression to ignite climate action and gender equality.",
};

export default async function ArtvocacyPage() {
  const result = await getArtvocacies();
  const artvocacies = result.success ? result.data : [];

  return (
    <div className="flex flex-col min-h-screen font-outfit">
      <Hero 
        title="Artvocacy"
        subtitle="Harnessing the power of creative expression to amplify community stories and drive meaningful change."
        backgroundImage="/images/gallery/whatsapp-image-2025-06-15-at-22.12.27_a35a7497.jpg"
        height="half"
      />

      <section className="section-padding bg-slate-50 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -mr-48 -mt-48 h-[600px] w-[600px] rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 h-[600px] w-[600px] rounded-full bg-brand-forest/5 blur-3xl pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-brand-orange">Creative Advocacy</h2>
            <h3 className="mb-8 text-4xl font-extrabold text-slate-900 md:text-5xl lg:text-6xl tracking-tight">
              Where <span className="header-highlight highlight-cyan text-brand-navy">Art</span> Meets Impact
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-medium pt-8">
              Artvocacy is our unique methodology that leverages visual arts, performance, and creative storytelling to dismantle complex climate narratives and spark grassroots justice.
            </p>
          </div>

          {artvocacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {artvocacies.map((item: any, idx: number) => (
                <div 
                  key={item.id} 
                  className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-4/5 overflow-hidden">
                    <Image 
                      src={item.image || "/images/gallery/IMG_2023.JPG"} 
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <h4 className="text-2xl font-black mb-2 tracking-tight transition-transform group-hover:-translate-y-2 duration-500">
                        {item.title}
                      </h4>
                      {item.content && (
                         <p className="text-sm text-slate-200 line-clamp-3 mb-6 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500">
                           {item.content}
                         </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        {item.url ? (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-white hover:text-black transition-all active:scale-95"
                          >
                            Explore <ExternalLink size={14} />
                          </a>
                        ) : (
                           <div className="h-1 w-10 bg-brand-cyan rounded-full"></div>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          {idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 shadow-inner">
               <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Maximize2 size={40} strokeWidth={1} />
               </div>
               <h4 className="text-2xl font-black text-slate-400 mb-2">Artvocacy Gallery Coming Soon</h4>
               <p className="text-slate-400 font-medium max-w-sm mx-auto">We are currently curating our latest visual impact stories. Check back soon for the exhibition.</p>
            </div>
          )}

          {/* Featured Quote or Call to action */}
          <div className="mt-32 pt-24 border-t border-slate-100">
             <div className="bg-brand-navy rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-brand-cyan/10 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                   <span className="text-brand-orange text-5xl font-serif mb-8 opacity-20">"</span>
                   <blockquote className="text-2xl md:text-4xl font-black text-white leading-tight mb-12 italic tracking-tight">
                     Art is not a mirror held up to reality but a hammer with which to shape it. Our creativity is our most potent weapon for climate justice.
                   </blockquote>
                   <div className="w-16 h-1 bg-brand-orange mb-8 rounded-full"></div>
                   <p className="text-brand-cyan font-black uppercase tracking-widest text-sm">Rooted Rising Philosophy</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
