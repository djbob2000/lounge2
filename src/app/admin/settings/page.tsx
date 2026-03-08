import { getSettingsAction } from "@/actions/settings";
import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettingsAction();

  // Provide defaults if database fetch fails
  const initialData = settings || {
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    instagramUrl: null,
    facebookUrl: null,
    behanceUrl: null,
  };

  return (
    <div className="w-full">
      <AdminHeader title="Global Settings" />

      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl font-bold">Application Preferences</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your main portfolio information and social links.
          </p>
        </div>

        <SettingsManager initialSettings={initialData} />
      </div>
    </div>
  );
}
