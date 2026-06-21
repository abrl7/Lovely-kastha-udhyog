import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import AdminNav from "@/components/admin/AdminNav";

/*
  This layout wraps every route under app/admin/dashboard/ (and any
  future protected admin pages placed alongside it, NOT login/signup —
  those live as siblings outside this folder specifically so they don't
  get caught by this same auth check, which would create a redirect
  loop: visit login -> not logged in -> redirect to login -> not logged
  in -> redirect to login...).

  WHY A SERVER COMPONENT CHECK, NOT A CLIENT-SIDE ONE:
  This file has no "use client" directive, which means it runs on the
  server, before any HTML is sent to the browser. If there's no valid
  session, `redirect()` sends the browser a redirect response directly —
  the dashboard's actual content is never rendered or transmitted at all.

  A client-side check (e.g. a useEffect that calls /api/auth/me and
  redirects if null) would instead briefly render the dashboard shell —
  and possibly flash real data — before JavaScript runs and notices the
  user isn't authenticated. For an admin panel, server-side gating is the
  meaningfully safer default.
*/
export default async function AdminDashboardLayout({ children }) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-soft">
      <AdminNav adminName={admin.name} />
      <div className="px-6 py-8 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
