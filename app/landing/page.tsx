import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LandingContent from "./LandingContent";

export default async function LandingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }
  return <LandingContent />;
}
