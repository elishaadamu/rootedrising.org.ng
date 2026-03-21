"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, logout } from "@/lib/actions/auth";
import { getBlogCategories } from "@/lib/actions/blog";
import { searchContent } from "@/lib/actions/search";
import { Search, Loader2 } from "lucide-react";


const navLinks = [
  { name: "Home", href: "/" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "About Us", href: "/about" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ pages: any[], posts: any[] }>({ pages: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
 
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [s, cats] = await Promise.all([getSession(), getBlogCategories()]);
      setSession(s);
      setCategories(cats);
    };
    fetchData();
  }, [pathname]);


  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          // Local Navlinks Search
          const filteredLinks = navLinks.filter(link => 
            link.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          // Server Post Search
          const { posts } = await searchContent(searchQuery);
          
          setSearchResults({
            pages: filteredLinks,
            posts: posts || []
          });
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ pages: [], posts: [] });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    setSession(null);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300 px-6 py-4 md:px-12 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/50 shadow-lg transition-transform hover:scale-110">
            <Image
              src="/images/logo.png"
              alt="Rooted Rising Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">Rooted Rising</span>
            <span className="text-xs md:text-sm font-bold text-brand-orange tracking-[0.4em] uppercase -mt-1">Initiative</span>
          </div>
        </Link>

        {/* Right-aligned Navigation and Actions */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            if (link.name === "Blogs") {
              return (
                <div 
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => setBlogDropdownOpen(true)}
                  onMouseLeave={() => setBlogDropdownOpen(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-black transition-all hover:text-brand-orange uppercase tracking-wider",
                      pathname.startsWith("/blogs") ? "text-brand-orange" : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.name}
                    <ChevronDown size={14} className={cn("transition-transform opacity-60", blogDropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {blogDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-48 overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-60"
                      >
                         {categories.map((cat) => (
                           <Link 
                             key={cat}
                             href={`/blogs/${cat.toLowerCase()}`}
                             className="block w-full text-left p-3 rounded-xl text-xs font-black text-white/70 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                           >
                              {cat}
                           </Link>
                         ))}
                         <div className="h-px bg-white/5 my-1 mx-2"></div>
                         <Link 
                           href="/blogs"
                           className="block w-full text-left p-3 rounded-xl text-[10px] font-black text-brand-orange/70 hover:text-brand-orange hover:bg-brand-orange/5 transition-all uppercase tracking-widest"
                         >
                            All Stories
                         </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-black transition-all hover:text-brand-orange uppercase tracking-wider",
                  pathname === link.href ? "text-brand-orange" : "text-white/80 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            {/* Search Trigger Icon - Desktop Right End */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-brand-orange hover:border-brand-orange hover:bg-white/10 transition-all group shadow-sm active:scale-95 mr-2"
              title="Search"
            >
              <Search size={22} className="transition-transform group-hover:scale-110" />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg">
                    <UserIcon size={16} />
                  </div>
                  <span className="max-w-[100px] truncate">{session.name}</span>
                  <ChevronDown size={14} className={cn("transition-transform opacity-60", userDropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-4xl bg-slate-900 p-2 shadow-2xl border border-white/10 backdrop-blur-xl"
                    >
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-white/90 hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-brand-orange" />
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl p-4 text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-black text-white/90 transition-all hover:text-brand-orange uppercase tracking-wider"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-brand-orange px-8 py-3 text-sm font-black text-white hover:text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(218,142,31,0.3)] active:scale-95 uppercase tracking-widest"
                >
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-brand-navy border-t border-white/5 mt-4 -mx-6 rounded-b-4xl shadow-2xl"
          >
            <div className="flex flex-col gap-1 p-6">
              {/* Mobile Search Trigger */}
              <div className="mb-6">
                 <button 
                   onClick={() => { setIsSearchModalOpen(true); setIsOpen(false); }}
                   className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                 >
                   <span className="text-sm font-bold">Search...</span>
                   <Search size={20} />
                 </button>
              </div>

              {navLinks.map((link) => {
                if (link.name === "Blogs") {
                  return (
                    <div key={link.name} className="flex flex-col">
                      <button
                        onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl text-base font-black transition-all uppercase tracking-widest",
                          pathname.startsWith("/blogs") ? "bg-white/10 text-brand-orange" : "text-white/80 hover:bg-white/5"
                        )}
                      >
                        {link.name}
                        <ChevronDown size={18} className={cn("transition-transform opacity-40", mobileBlogOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {mobileBlogOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col pl-6"
                          >
                            {categories.map((cat) => (
                              <Link
                                key={cat}
                                href={`/blogs/${cat.toLowerCase()}`}
                                className="p-4 text-sm font-bold text-white/60 hover:text-white uppercase tracking-widest"
                                onClick={() => { setIsOpen(false); setMobileBlogOpen(false); }}
                              >
                                {cat}
                              </Link>
                            ))}
                            <Link
                              href="/blogs"
                              className="p-4 text-sm font-bold text-brand-orange/60 hover:text-brand-orange uppercase tracking-widest"
                              onClick={() => { setIsOpen(false); setMobileBlogOpen(false); }}
                            >
                              All Stories
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl text-base font-black transition-all uppercase tracking-widest",
                      pathname === link.href ? "bg-white/10 text-brand-orange" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <ArrowRight size={16} className="opacity-40" />
                  </Link>
                );
              })}
              
              <div className="mt-4 pt-6 border-t border-white/5 flex flex-col gap-4">
                {session ? (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-xl">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <p className="text-base font-black">{session.name}</p>
                        <p className="text-xs text-white/40">{session.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center justify-center p-4 rounded-2xl border border-white/10 text-base font-black text-white gap-3 uppercase tracking-widest"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard size={20} className="text-brand-orange" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center p-4 rounded-2xl bg-rose-500/10 text-rose-400 text-base font-black gap-3 uppercase tracking-widest"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center p-4 rounded-2xl border border-white/10 text-base font-black text-white uppercase tracking-widest"
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center p-4 rounded-2xl bg-brand-orange text-white text-base font-black shadow-xl uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Join Us
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal - Covers Header/Footer via fixed positioning and high z-index */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-slate-950/95 backdrop-blur-2xl flex flex-col p-6 md:p-12 lg:p-24 overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={() => { setIsSearchModalOpen(false); setSearchQuery(""); }}
              className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all shadow-2xl"
            >
              <X size={24} />
            </button>

            <div className="mx-auto max-w-4xl w-full flex flex-col pt-12">
               {/* Large Search Input */}
               <div className="relative mb-20 group">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search anything..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl lg:text-6xl font-black text-white placeholder:text-white/10 focus:outline-none focus:border-brand-orange transition-all pb-8 pr-16"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-orange transition-colors">
                     {isSearching ? <Loader2 size={40} className="animate-spin" /> : <Search size={40} />}
                  </div>
               </div>

               {/* Large Results Display */}
               <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                  {/* Navigation Links Results */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-brand-orange mb-10 border-b border-brand-orange/20 pb-4">Navigation</h4>
                    <div className="space-y-4">
                      {searchResults.pages.length > 0 ? searchResults.pages.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => { setIsSearchModalOpen(false); setSearchQuery(""); }}
                          className="flex items-center justify-between p-6 rounded-4xl bg-white/5 border border-white/5 hover:bg-brand-orange hover:border-brand-orange transition-all group"
                        >
                          <span className="text-xl font-black text-white">{link.name}</span>
                          <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-white" />
                        </Link>
                      )) : (
                        <p className="text-white/20 italic font-medium">No pages matching your search...</p>
                      )}
                    </div>
                  </div>

                  {/* Posts & Campaigns Results */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-brand-teal mb-10 border-b border-brand-teal/20 pb-4">Latest Stories</h4>
                    <div className="space-y-6">
                      {searchResults.posts.length > 0 ? searchResults.posts.map((post: any) => (
                        <Link
                          key={post.slug}
                          href={post.url}
                          onClick={() => { setIsSearchModalOpen(false); setSearchQuery(""); }}
                          className="flex flex-col group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                             <span className="px-3 py-1 rounded-full bg-brand-forest/30 text-[10px] font-black text-brand-forest uppercase tracking-widest">{post.section}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h5 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors leading-snug">{post.title}</h5>
                          <div className="h-px w-full bg-white/5 mt-6 group-hover:bg-brand-orange/20 transition-all"></div>
                        </Link>
                      )) : (
                        <p className="text-white/20 italic font-medium">No impact stories found...</p>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
