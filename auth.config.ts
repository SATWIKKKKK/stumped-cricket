import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;

export default authConfig;
