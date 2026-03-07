import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Make sure to get your Better Auth instance

export async function GET() {
  try {
    const existingUsers = await db.query.users.findMany();
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Admin user already exists. Initial setup is locked." },
        { status: 403 },
      );
    }

    // Since BetterAuth creates users differently based on the adapter,
    // the safest programmatic way to insert an initial user with salt/hash
    // without using the UI is using the internal API if reachable,
    // or we just enable registration temporarily, or use an API wrapper.
    // For Better Auth we can call the sign up internal function, but since it's an API route...

    // As a workaround for the initial boot up without exposing emailAndPassword.signUp:
    // We will instruct the user to temporarily enable sign-ups, or we can use the better-auth client API.
    return NextResponse.json({
      message:
        "To create the admin, please temporarily set emailAndPassword.enabled to true in src/lib/auth.ts, login via a signup form (or API call), and then turn it back off.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database not configured yet." },
      { status: 500 },
    );
  }
}
