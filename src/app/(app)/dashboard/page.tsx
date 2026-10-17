import { requireTenantContext } from "@/lib/tenancy/context";
import { prisma } from "@/lib/db/prisma";
import SignOutButton from "@/components/sign-out-button";
export default async function DashboardPage() {
  let ctx;
  try {
    ctx = await requireTenantContext();
  } catch {
    return (
      <section>
        <h1 className="text-3xl font-semibold">Choose your company</h1>
        <p className="mt-2 text-slate-600">
          Your account needs an active company membership. A platform
          administrator must verify newly registered companies.
        </p>
      </section>
    );
  }
  const [employees, pending, approved] = await Promise.all([
    prisma.employee.count({ where: { tenantId: ctx.tenantId, active: true } }),
    prisma.leaveRequest.count({
      where: {
        tenantId: ctx.tenantId,
        status: { in: ["PENDING", "NEEDS_REVIEW"] },
      },
    }),
    prisma.leaveRequest.count({
      where: { tenantId: ctx.tenantId, status: "APPROVED" },
    }),
  ]);
  const cards = [
    { label: "Active employees", value: employees },
    { label: "Requests awaiting review", value: pending },
    { label: "Approved requests", value: approved },
  ];
  return (
    <>
      <div>
        <p className="text-sm text-slate-500">Company workspace</p>
        <header className="flex items-center justify-between">
          <h1 className="mt-1 text-3xl font-semibold">
            {ctx.tenant.name} dashboard
          </h1>
          <SignOutButton />
        </header>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Getting started</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-600">
          <li>Add employee records.</li>
          <li>Configure leave types and effective-dated policy versions.</li>
          <li>Link employee accounts and manager relationships.</li>
          <li>
            Test approval and insufficient-balance exception paths before
            launch.
          </li>
        </ul>
      </div>
    </>
  );
}
