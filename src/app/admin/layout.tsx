import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";

const AUTH_COOKIE_NAME = "propulsa_auth";
const AUTH_COOKIE_VALUE = "authenticated";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;

  if (!isAuthenticated) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-background lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
