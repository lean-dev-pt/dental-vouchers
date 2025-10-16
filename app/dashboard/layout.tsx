import { AuthButton } from "@/components/auth-button";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ClinicNameDisplay } from "@/components/dashboard/clinic-name-display";
import { EmailConfirmationChecker } from "@/components/email-confirmation-checker";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/70">
      {/* Email Confirmation Dialog */}
      <EmailConfirmationChecker />

      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b-2 border-teal-100 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="ml-12 md:ml-0">
              <ClinicNameDisplay />
            </div>
            <div className="flex items-center gap-4">
              <AuthButton />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
