"use client";

import Link from "next/link";
import { Check, Mail, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { verifyEmail } from "@/lib/auth-actions";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus("success");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    });
  }, [token]);

  return (
    <AuthPanel
      icon={
        status === "success" ? <Check size={21} /> :
        status === "error" ? <X size={21} /> :
        <Mail size={20} />
      }
      eyebrow="Email verification"
      title={
        status === "success" ? "Email verified" :
        status === "error" ? "Verification failed" :
        "Verifying..."
      }
      description={message}
      footer={
        <>
          <span><Mail size={11} /> Demo verification</span>
          <span>In-memory store</span>
        </>
      }
    >
      <div className="mt-5 text-center text-[0.65rem] text-[#6f8298]">
        {status === "success" && (
          <Link href="/login" className="text-[#72cdea] hover:text-[#b4eaff] transition-colors">
            Continue to sign in
          </Link>
        )}
        {status === "error" && (
          <Link href="/register" className="text-[#72cdea] hover:text-[#b4eaff] transition-colors">
            Register a new account
          </Link>
        )}
        {status === "loading" && (
          <p className="text-[#8fa1b5]">Please wait...</p>
        )}
      </div>
    </AuthPanel>
  );
}
