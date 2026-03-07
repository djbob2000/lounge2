"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SetupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      setError(error.message || "Failed to create admin account");
      setLoading(false);
      return;
    }

    if (data) {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSetup} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-foreground">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
          placeholder="Elena Marinych"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-foreground">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
          placeholder="admin@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-white text-sm font-bold tracking-wide rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Complete Setup"}
      </button>
    </form>
  );
}
