import config from "@/lib/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseURL = config.env.neonPostgress.databaseURL;
if (!databaseURL) {
  throw new Error("Database URL is not defined in environment variables.");
}
const sql = neon(databaseURL);

export const db = drizzle( { client: sql});
