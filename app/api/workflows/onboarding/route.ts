import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";


type InitialData = {
  email: string;
  fullName?: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAY_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAY_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if (user.length === 0) return "non-active";
    const lastActivity = new Date(user[0].lastActivity!);
    const now = new Date();
    const timedifference = now.getTime() - lastActivity.getTime();
  return timedifference > THREE_DAY_IN_MS && timedifference <= THIRTY_DAY_IN_MS ? "non-active" : "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to our platform",
      message: `Hello ${fullName || "User"},\n\nThank you for signing up! We're excited to have you on board.\n\nBest regards,\nThe Team`
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "We miss you!",
          message: `Hello ${fullName || "User"},\n\n It's been a while since we last saw you. We hope everything is okay! If you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nThe Team`
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Thank you for being active!",
          message: `Hello ${fullName || "User"},\n\n Thank you for staying active on our platform! We appreciate your engagement and support.\n\nBest regards,\nThe Team`
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});


