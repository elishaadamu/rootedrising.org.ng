import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Linkedin, Facebook, Instagram, Mail, Calendar, User, ShieldCheck } from "lucide-react";
import { getTeamMemberById } from "@/lib/actions/team";
import BackButton from "@/components/common/BackButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getTeamMemberById(id);
  
  if (!result.success || !result.data) {
    return {
      title: "Team Member Not Found",
    };
  }

  const member = result.data;
  return {
    title: `${member.name} | Rooted Rising Team`,
    description: member.bio.substring(0, 160),
    openGraph: {
      title: `${member.name} | Rooted Rising Team`,
      description: member.bio.substring(0, 160),
      images: member.image ? [{ url: member.image }] : [],
    },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const result = await getTeamMemberById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const member = result.data;

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-20">
      {/* Decorative background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-950 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <BackButton />

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative group overflow-hidden">                
                <div className="relative aspect-square w-full rounded-[32px] overflow-hidden mb-8 shadow-inner ring-4 ring-slate-50">
                    <Image 
                        src={member.image || "/images/gallery/IMG_2006.JPG"} 
                        alt={member.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                <div className="text-center space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{member.name}</h1>
                        <p className="text-lg font-bold text-brand-forest uppercase tracking-widest text-sm">{member.role}</p>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-forest hover:text-white transition-all transform hover:-translate-y-1">
                                <Linkedin size={20} strokeWidth={1.5} />
                            </a>
                        )}
                        {member.facebook && (
                            <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-forest hover:text-white transition-all transform hover:-translate-y-1">
                                <Facebook size={20} strokeWidth={1.5} />
                            </a>
                        )}
                        {member.instagram && (
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-forest hover:text-white transition-all transform hover:-translate-y-1">
                                <Instagram size={20} strokeWidth={1.5} />
                            </a>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-forest hover:text-white transition-all transform hover:-translate-y-1">
                                <Mail size={20} strokeWidth={1.5} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100 space-y-6">
                    {member.role && (
                        <div className="flex items-center gap-4 group/item">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leadership Role</p>
                                <p className="text-sm font-bold text-slate-700">{member.role}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4 group/item">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
                            <p className="text-sm font-bold text-slate-700">{new Date(member.createdAt).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-forest rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-brand-forest/20">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
                <h4 className="text-xl font-bold mb-4">Get in touch</h4>
                <p className="text-indigo-50/80 mb-6 text-sm leading-relaxed">Interested in collaborating or have questions for {member.name.split(' ')[0]}?</p>
                <Link href="/contact" className="block w-full">
                   <div className="w-full bg-white/10 border border-white/20 hover:bg-white text-white hover:text-brand-forest rounded-2xl h-12 flex items-center justify-center font-bold transition-all">
                      Send a Message
                   </div>
                </Link>
            </div>
          </div>

          {/* Bio & Details Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px w-12 bg-brand-forest"></div>
                        <span className="text-brand-forest font-bold uppercase tracking-[0.2em] text-xs">Profile Overview</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
                        Driving <span className="header-highlight highlight-yellow">Impactful Change</span> in our Communities.
                    </h2>
                    
                    <div className="prose prose-slate prose-lg max-w-none">
                        {member.bio.split('\n').map((paragraph, i) => (
                           paragraph.trim() && (
                            <p key={i} className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">
                                {paragraph}
                            </p>
                           )
                        ))}
                    </div>

                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
