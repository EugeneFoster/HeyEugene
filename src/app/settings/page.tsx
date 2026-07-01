import { TopBar } from "@/components/layout/TopBar";
import { getTenants } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils/format";

export default async function SettingsPage() {
  const tenants = await getTenants();

  return (
    <>
      <TopBar title="Settings" />
      <div className="p-6 space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Profile</h2>
          <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Business name</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                defaultValue="HeyEugene"
                readOnly
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Contact email</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                defaultValue="eugene@heyeugene.com"
                readOnly
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Projects / Tenants</h2>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 font-medium">
                  {tenant.emoji} {tenant.name}
                </h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[var(--text-secondary)]">Prefix</dt>
                    <dd className="font-mono">{tenant.prefix}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-secondary)]">Hourly rate</dt>
                    <dd>{formatCurrency(tenant.hourly_rate, tenant.currency)}/hr</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-secondary)]">Tax</dt>
                    <dd>GST {(tenant.tax_rate * 100).toFixed(0)}%</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-secondary)]">Contact</dt>
                    <dd>{tenant.contact_name ?? "—"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[var(--text-secondary)]">Address</dt>
                    <dd>{tenant.address ?? "—"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[var(--text-secondary)]">Payment instructions</dt>
                    <dd>{tenant.payment_instructions ?? "—"}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Integrations</h2>
          <div className="max-w-lg rounded-xl border border-gray-100 bg-white p-5 shadow-sm text-sm text-[var(--text-secondary)]">
            <p>Stripe, Resend email, and Supabase connection settings — coming soon.</p>
          </div>
        </section>
      </div>
    </>
  );
}
