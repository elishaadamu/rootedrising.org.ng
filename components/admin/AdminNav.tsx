"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ArrowLeft,
  Bell,
  LogOut,
  Home
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { toast } from "sonner";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  subLinks?: { name: string; href: string }[];
}

interface AdminNavProps {
  sidebarLinks: SidebarLink[];
  session: {
    name: string | null;
    role: string | null;
  };
  children: React.ReactNode;
}

export default function AdminNav({ sidebarLinks, session, children }: AdminNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const NavItem = ({ link, isMobile = false }: { link: SidebarLink; isMobile?: boolean }) => {
    const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
    const hasSubLinks = link.subLinks && link.subLinks.length > 0;
    const isSubMenuOpen = openSubMenu === link.name;

    return (
      <div className="space-y-1">
        <div 
          className={cn(
            "flex items-center justify-between gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all cursor-pointer group",
            isActive
              ? "bg-brand-forest/10 text-brand-forest" 
              : "text-slate-600 hover:bg-slate-50 hover:text-brand-forest"
          )}
          onClick={() => {
            if (hasSubLinks) {
              setOpenSubMenu(isSubMenuOpen ? null : link.name);
            } else {
              router.push(link.href);
              if (isMobile) setIsOpen(false);
            }
          }}
        >
          <div className="flex items-center gap-4">
            <span className={cn(
              "transition-colors",
              isActive ? "text-brand-forest" : "text-slate-400 group-hover:text-brand-forest"
            )}>
              {link.icon}
            </span>
            {link.name}
          </div>
          {hasSubLinks && (
            <motion.span
              animate={{ rotate: isSubMenuOpen ? 180 : 0 }}
              className="text-slate-400"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.span>
          )}
        </div>

        <AnimatePresence>
          {hasSubLinks && isSubMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pl-14 space-y-1"
            >
              {link.subLinks?.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className={cn(
                    "block py-2 text-xs font-bold transition-colors",
                    pathname === sub.href ? "text-brand-forest" : "text-slate-400 hover:text-brand-forest"
                  )}
                  onClick={() => { if (isMobile) setIsOpen(false); }}
                >
                  {sub.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 hidden lg:flex flex-col"
      )}>
        <div className="p-8 border-b border-slate-100 shrink-0">
           <Logo isDark className="scale-110 origin-left" />
           <p className="text-[10px] font-black uppercase tracking-widest text-brand-cyan mt-2">Administrative Portal</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {sidebarLinks.map((link) => (
            <NavItem key={link.name} link={link} />
          ))}
        </nav>

        <div className="p-8 border-t border-slate-50 shrink-0">
           <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-forest transition-colors"
           >
             <ArrowLeft size={16} /> Back to Site
           </Link>
        </div>
      </aside>

      {/* Mobile Sidebar (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 lg:hidden flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
               <div>
                 <Logo isDark className="origin-left" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-cyan mt-2">Administrative Portal</p>
               </div>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="p-2 text-slate-400 hover:text-slate-600"
               >
                 <X size={24} />
               </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
              {sidebarLinks.map((link) => (
                <NavItem key={link.name} link={link} isMobile />
              ))}
            </nav>

            <div className="p-8 border-t border-slate-50 shrink-0">
               <Link 
                href="/" 
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-forest transition-colors"
               >
                 <ArrowLeft size={16} /> Back to Site
               </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsOpen(true)}
               className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden"
             >
               <Menu size={24} />
             </button>
             <h1 className="text-lg font-black text-slate-900 hidden sm:block">Admin Dashboard</h1>
             <h1 className="text-base font-black text-slate-900 sm:hidden">Admin</h1>
           </div>
           
           <div className="flex items-center gap-2 sm:gap-6">
              {/* Home & Notification */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Link 
                  href="/" 
                  className="p-2 text-slate-400 hover:text-brand-forest hover:bg-slate-50 rounded-xl transition-all"
                  title="Visit Website"
                >
                  <Home size={20} />
                </Link>
                <button className="relative p-2 text-slate-400 hover:text-brand-forest hover:bg-slate-50 rounded-xl transition-all">
                   <Bell size={20} />
                   <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 border border-white"></span>
                </button>
              </div>
              
              <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-200 group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none">{session.name}</p>
                  <p className="text-[9px] font-bold text-brand-cyan uppercase tracking-wider mt-1">{session.role}</p>
                </div>
                <div className="relative group/user">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-forest text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-lg shadow-brand-forest/20" title="Profile Avatar">
                    {session.name?.charAt(0)}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-1">
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </header>

        <div className="flex-1 p-4 sm:p-8">
          {children}
        </div>

        {/* Admin Footer */}
        <footer className="mt-auto px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white/50 gap-4">
           <div className="flex items-center gap-3">
              <Logo className="h-4 w-auto" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative Portal</span>
           </div>
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center sm:text-right">
              Powered by <span className="text-slate-900">Next.js</span>
           </p>
        </footer>
      </main>
    </div>
  );
}
