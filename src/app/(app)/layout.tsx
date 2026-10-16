import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); if (!session) redirect("/signin");
  return <div className="min-h-screen"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href="/dashboard" className="font-semibold">OmniStaff</Link><nav className="flex gap-5 text-sm text-slate-600"><Link href="/dashboard">Dashboard</Link><Link href="/employees">Employees</Link><Link href="/leave">Leave</Link><Link href="/reports">Reports</Link><Link href="/company/setup">Company setup</Link><Link href="/company/invitations">Invitations</Link><Link href="/company/leave-policies">Leave policies</Link><Link href="/admin">Platform admin</Link></nav><span className="text-sm text-slate-500">{session.user.email}</span></div></header><main className="mx-auto max-w-7xl px-6 py-8">{children}</main></div>;
}
