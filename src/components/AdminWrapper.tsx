"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="lg:ml-60 min-h-screen">
        {children}
      </div>
    </>
  );
}
