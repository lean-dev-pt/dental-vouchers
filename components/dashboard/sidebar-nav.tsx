"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Receipt,
  Users,
  Stethoscope,
  Menu,
  X,
  User2,
  ChevronUp,
  LogOut,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    title: "Cheques Dentista",
    href: "/dashboard/vouchers",
    icon: Receipt,
    gradient: "from-teal-500 to-cyan-500",
    hoverGradient: "hover:from-teal-600 hover:to-cyan-600"
  },
  {
    title: "Pacientes",
    href: "/dashboard/patients",
    icon: Users,
    gradient: "from-emerald-500 to-green-500",
    hoverGradient: "hover:from-emerald-600 hover:to-green-600"
  },
  {
    title: "Médicos",
    href: "/dashboard/doctors",
    icon: Stethoscope,
    gradient: "from-violet-500 to-purple-500",
    hoverGradient: "hover:from-violet-600 hover:to-purple-600"
  },
  {
    title: "Relatórios",
    href: "/dashboard/reports",
    icon: Activity,
    gradient: "from-blue-500 to-indigo-500",
    hoverGradient: "hover:from-blue-600 hover:to-indigo-600"
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      // Get user data
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email) {
        setUserEmail(userData.user.email);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-xl border-2 border-teal-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-teal-600" />
        ) : (
          <Menu className="h-5 w-5 text-teal-600" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-white via-teal-50/30 to-cyan-50/30 border-r-2 border-teal-100 transition-transform shadow-xl",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-center border-b-2 border-teal-100 px-6 bg-gradient-to-r from-teal-500 to-cyan-500">
            <h2 className="text-lg font-extrabold text-white">Cheques Dentista</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href === "/dashboard/vouchers" && pathname === "/dashboard");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 transform hover:scale-105",
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 text-gray-700 hover:text-gray-900"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isActive
                      ? "bg-white/20"
                      : "bg-gradient-to-r " + item.gradient + " text-white"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : ""
                    )} />
                  </div>
                  <span className="font-bold">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {userEmail && (
            <div className="border-t-2 border-teal-100 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
                        <User2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 truncate max-w-[140px]">
                        {userEmail}
                      </span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-[240px] mb-2"
                >
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/dashboard/account">
                      <User2 className="mr-2 h-4 w-4" />
                      <span>Conta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}