"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import PreLoginHeader from "@/components/pre-login-header";
import PreLoginFooter from "@/components/pre-login-footer";
import { HeroSection } from "@/components/Hero-section";

export default function LandingPage() {
  return (
    <>
      <PreLoginHeader />
      <main className="min-h-[calc(100vh-160px)]">
      
{/* Hero */}
<section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)] px-6 py-28 overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/40 to-background" />
  <HeroSection/>
  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
    <Link href="/signup">
      <Button size="lg" className="w-full sm:w-auto cursor-pointer">
        Get started free
      </Button>
    </Link>
    <Link href="/signin">
      <Button size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer">
        Sign in
      </Button>
    </Link>
  </div>

  <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
    <div>99.99% uptime</div>
    <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
    <div>Global regions</div>
    <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
    <div>Pay as you grow</div>
  </div>
</section>
      </main>
      <PreLoginFooter />
    </>
  );
}
