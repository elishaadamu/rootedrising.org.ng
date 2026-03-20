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


const navLinks = [
  { name: "Home", href: "/" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "About Us", href: "/about" },
  { name: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
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


  const handleLogout = async () => {
    await logout();
    setSession(null);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-navy border-b border-white/5 transition-all duration-300 px-6 py-4 md:px-12 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group shrink-0">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.1 }}
            className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/50 shadow-lg"
          >
            <Image
              src="/images/logo.png"
              alt="Rooted Rising Logo"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">Rooted Rising</span>
            <span className="text-xs md:text-sm font-bold text-brand-orange tracking-[0.4em] uppercase -mt-1">Initiative</span>
          </div>
        </Link>

        {/* Global Search Bar - Redesigned for Dark Mode */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-12">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none transition-all pr-12"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-brand-orange transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
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
                        className="absolute left-0 mt-2 w-48 overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-[60]"
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
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-[2rem] bg-slate-900 p-2 shadow-2xl border border-white/10 backdrop-blur-xl"
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
            className="md:hidden overflow-hidden bg-brand-navy border-t border-white/5 mt-4 -mx-6 rounded-b-[2rem] shadow-2xl"
          >
            <div className="flex flex-col gap-1 p-6">
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
    </nav>
  );
}
