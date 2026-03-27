import type { NextAuthOptions } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt" as const,
  },
} satisfies Partial<NextAuthOptions>;

export default authConfig;
