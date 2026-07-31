import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { compare } from "bcryptjs";
import { findUserByEmail, findUserById, createUser } from "@/lib/db";

declare module "next-auth" {
  interface User {
    twoFactorEnabled?: boolean;
    requiresTwoFactor?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      twoFactorEnabled: boolean;
    };
  }
}

interface AuthToken {
  id: string;
  email?: string | null;
  name?: string | null;
  twoFactorEnabled: boolean;
  requiresTwoFactor?: boolean;
  [key: string]: unknown;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    MicrosoftEntraID({
      clientId: process.env.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = findUserByEmail(email);
        if (!user || !user.passwordHash) return null;

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          twoFactorEnabled: user.twoFactorEnabled,
          requiresTwoFactor: user.twoFactorEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, auto-create user if not exists
      if (account?.provider && account.provider !== "credentials") {
        const email = user.email;
        if (!email) return false;

        const existing = findUserByEmail(email);
        if (!existing) {
          createUser({
            email,
            passwordHash: null,
            name: user.name ?? null,
            emailVerified: true,
            twoFactorEnabled: false,
            twoFactorSecret: null,
            otpCode: null,
            otpExpiry: null,
            resetToken: null,
            resetExpiry: null,
            verifyToken: null,
            provider: account.provider,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = findUserByEmail(user.email ?? "");
        (token as AuthToken).id = dbUser?.id ?? user.id ?? "";
        (token as AuthToken).twoFactorEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;
        (token as AuthToken).requiresTwoFactor = (user as { requiresTwoFactor?: boolean }).requiresTwoFactor ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token as AuthToken).id;
      session.user.twoFactorEnabled = (token as AuthToken).twoFactorEnabled;
      return session;
    },
  },
});

/**
 * Helper to get user from database by session token id.
 * Used in server actions and API routes.
 */
export function getUserFromDb(id: string) {
  return findUserById(id);
}
