import NextAuth from "next-auth";
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { eq, and } from "drizzle-orm";
import { users } from "./database/schema"; // Make sure this import points to your users table definition
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        const user = await db
          .select()
          .from(users)
          .where(and(eq(users.email, email.toString())))
          .limit(1);
        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          password.toString(),
          user[0].password
        );

        if (!isPasswordValid) return null;
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName, // مهم هنا الاسم يكون 'name' مش 'fullName'
          role: user[0].role,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        
      }
      return session;
    },
  },
});
