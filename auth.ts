import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import {
  createGoogleUserIfMissing,
  findUserByEmail,
  findUserByPlayerId,
  getSafeUserById,
} from "@/lib/server/repositories";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "stumped-ai-dev-secret-change-in-production",
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        playerId: { label: "Player ID", type: "text" },
        accessKey: { label: "Access Key", type: "password" },
      },
      async authorize(credentials) {
        const playerId = String(credentials?.playerId ?? "").trim();
        const accessKey = String(credentials?.accessKey ?? "").trim();

        if (!playerId || !accessKey) {
          return null;
        }

        const user = await findUserByPlayerId(playerId);
        if (!user?.passwordHash) {
          return null;
        }

        const ok = await compare(accessKey, user.passwordHash);
        if (!ok) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await createGoogleUserIfMissing({
        email: user.email,
        name: user.name ?? "Cricket User",
      });

      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;

      if (!email) {
        return token;
      }

      const dbUser = await findUserByEmail(email);
      if (!dbUser) {
        return token;
      }

      token.userId = dbUser.id;
      token.playerId = dbUser.playerId;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.role = dbUser.role;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = String((token as { userId?: string }).userId ?? "");
        (session.user as { playerId?: string }).playerId = String((token as { playerId?: string }).playerId ?? "");
        (session.user as { role?: string }).role = String((token as { role?: string }).role ?? "user");
      }

      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

export async function getCurrentSafeUser() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  return getSafeUserById(userId);
}
