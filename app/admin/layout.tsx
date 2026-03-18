import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  LayoutDashboard, 
  Mail,
  Send,
  Lock,
  ClipboardList,
  Play,
  Sparkles
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Blog Posts", href: "/admin/blog", icon: <FileText size={20} /> },
    { name: "Campaign Highlights", href: "/admin/highlights", icon: <Sparkles size={20} /> },
    { name: "Pamphlets", href: "/admin/pamphlets", icon: <FileText size={20} /> },
    { name: "Artvocacy", href: "/admin/artvocacy", icon: <FileText size={20} /> },
    { name: "Advocacy Videos", href: "/admin/videos", icon: <Play size={20} /> },
    { name: "Team", href: "/admin/team", icon: <Users size={20} /> },
    { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} /> },
    { name: "Comments", href: "/admin/comments", icon: <MessageSquare size={20} /> },
    { name: "Subscribers", href: "/admin/subscribers", icon: <Mail size={20} /> },
    { name: "Email Campaigns", href: "/admin/campaigns", icon: <Send size={20} /> },
    { name: "Security", href: "/admin/settings/password", icon: <Lock size={20} /> },
    { name: "Activity Logs", href: "/admin/logs", icon: <ClipboardList size={20} /> },
  ];

  return (
    <AdminNav 
      sidebarLinks={sidebarLinks}
      session={{
        name: session.name as string,
        role: session.role as string
      }}
    >
      {children}
    </AdminNav>
  );
}
