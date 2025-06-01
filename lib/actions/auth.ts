"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // Adjust the method below according to your ratelimit library's API, e.g., .check(ip) or .limit(ip)
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");
  console.log("IP Address:", ip);

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, message: result.error };
    }

    return { success: true, user: result?.user };
  } catch (error) {
    console.log(error, "Error signing in user");
    return { success: false, message: "Error signing in user" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { email, password, fullName, universityId, universityCard } = params;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, message: "User already exists with this email" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    const newUser = await db
      .insert(users)
      .values({
        fullName,
        email,
        password: hashedPassword,
        universityId,
        universityCard,
      });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
      body: { email, fullName },
    });

    await signInWithCredentials({ email, password });
    return { success: true, user: newUser };
  } catch (error) {
    console.log(error, "Error creating user");
    return { success: false, message: "Error creating user" };
  }
};
