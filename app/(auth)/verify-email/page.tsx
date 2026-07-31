import { Suspense } from "react";
import VerifyEmailContent from "./verify-content";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
