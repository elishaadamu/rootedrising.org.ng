import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
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
  if (!session) {
    redirect("/login");
  }

  // Fetch the latest role from the database to ensure immediate effect of role changes
  const dbUser = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: { role: true, name: true }
  });

  if (!dbUser) {
    redirect("/login");
  }

  const role = dbUser.role;
  const isAdmin = role === "ADMIN";
  const isEditor = role === "EDITOR";
  const isUser = role === "USER";

  // Filter routes based on role
  const allLinks = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "EDITOR", "USER"] },
    { name: "Users", href: "/admin/users", icon: <Users size={20} />, roles: ["ADMIN"] },
    { name: "Blog Posts", href: "/admin/blog", icon: <FileText size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "Campaign Highlights", href: "/admin/highlights", icon: <Sparkles size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "Pamphlets", href: "/admin/pamphlets", icon: <FileText size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "Artvocacy", href: "/admin/artvocacy", icon: <FileText size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "VOTFL Videos", href: "/admin/videos", icon: <Play size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "Team", href: "/admin/team", icon: <Users size={20} />, roles: ["ADMIN"] },
    { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} />, roles: ["ADMIN"] },
    { name: "Comments", href: "/admin/comments", icon: <MessageSquare size={20} />, roles: ["ADMIN"] },
    { name: "Subscribers", href: "/admin/subscribers", icon: <Mail size={20} />, roles: ["ADMIN"] },
    { name: "Email Campaigns", href: "/admin/campaigns", icon: <Send size={20} />, roles: ["ADMIN", "EDITOR"] },
    { name: "Security", href: "/admin/settings/password", icon: <Lock size={20} />, roles: ["ADMIN", "EDITOR", "USER"] },
    { name: "Activity Logs", href: "/admin/logs", icon: <ClipboardList size={20} />, roles: ["ADMIN"] },
  ];

  const sidebarLinks = allLinks.filter(link => link.roles.includes(role));

  return (
    <AdminNav 
      sidebarLinks={sidebarLinks}
      session={{
        name: dbUser.name as string,
        role: dbUser.role as string
      }}
    >
      {children}
    </AdminNav>
  );
}
