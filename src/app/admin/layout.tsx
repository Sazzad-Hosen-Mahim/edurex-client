"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { logout } from "@/src/features/auth/authSlice";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar p-4 flex flex-col">
        <h1 className="mb-6 text-xl font-bold text-sidebar-foreground">
          Edurex Admin
        </h1>
        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="pt-6">
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
