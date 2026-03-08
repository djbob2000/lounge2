"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, Loader2, Save, Share2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSettingsAction } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Settings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  behanceUrl: string | null;
};

export function SettingsManager({ initialSettings }: { initialSettings: Settings }) {
  const [activeTab, setActiveTab] = useState<"general" | "social">("general");
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSettingsAction(settings);
      if (result.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Tab Switcher */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-border/50">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "general"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "social"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Social
        </button>
      </div>

      <div className="bg-card rounded-3xl border border-border p-8 lg:p-12 shadow-sm relative overflow-hidden group min-h-[500px]">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          {activeTab === "general" ? (
            <Globe className="w-64 h-64" />
          ) : (
            <Share2 className="w-64 h-64" />
          )}
        </div>

        <div className="max-w-xl relative z-10 h-full flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "general" ? (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h4 className="text-xl font-semibold mb-2">Profile Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Update the primary identity of your portfolio.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="siteName"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Portfolio Name
                    </Label>
                    <Input
                      id="siteName"
                      placeholder="e.g. Elena Marinych"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="siteDescription"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Meta Description
                    </Label>
                    <textarea
                      id="siteDescription"
                      rows={4}
                      placeholder="Briefly describe your photography style for search engines..."
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({ ...settings, siteDescription: e.target.value })
                      }
                      className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors focus:bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactEmail"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Contact Email
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="hello@example.com"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h4 className="text-xl font-semibold mb-2">Social Networks</h4>
                  <p className="text-sm text-muted-foreground">
                    Add links to your social profiles.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="instagram"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Instagram URL
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/your-profile"
                      value={settings.instagramUrl || ""}
                      onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="facebook"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Facebook URL
                    </Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/your-page"
                      value={settings.facebookUrl || ""}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="behance"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Behance URL
                    </Label>
                    <Input
                      id="behance"
                      placeholder="https://behance.net/your-works"
                      value={settings.behanceUrl || ""}
                      onChange={(e) => setSettings({ ...settings, behanceUrl: e.target.value })}
                      className="h-12 bg-background/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-8 mt-8 border-t border-border/50">
            <Button
              className="gap-2 px-8 h-12 rounded-xl text-md font-medium"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
