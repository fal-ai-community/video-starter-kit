"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("gostudio_auth");
    if (auth === "true") {
      setIsAuthed(true);
    } else {
      setIsAuthed(false);
      router.replace("/en");
    }
  }, [router]);

  // Still checking auth
  if (isAuthed === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0ff",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #e5e7eb",
            borderTopColor: "#7c3aed",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return <>{children}</>;
}
