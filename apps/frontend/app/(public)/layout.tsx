
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import PreLoginHeader from "@/components/pre-login-header";
import PreLoginFooter from "@/components/pre-login-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreLoginHeader />
      <main className="min-h-[calc(100vh-160px)] pt-16">
        {children}

      </main>
      <PreLoginFooter />
    </>
  );
}
