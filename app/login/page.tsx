import type { Metadata } from "next";
import { LoginExperience } from "@/components/login/login-experience";

export const metadata: Metadata = {
  title: "Enter workspace",
  description: "Enter the Sentiloop workspace preview.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginPage() {
  return <LoginExperience />;
}
