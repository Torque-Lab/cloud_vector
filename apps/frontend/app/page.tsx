"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PreLoginHeader from "@/components/pre-login-header";
import PreLoginFooter from "@/components/pre-login-footer";

export default function LandingPage() {
  return (
    <>
      <PreLoginHeader />
      <main className="min-h-[calc(100vh-160px)]">
      
{/* Hero */}
<section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-160px)] px-6 py-28 overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/40 to-background" />

  {/* Content */}
  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl max-w-3xl">
    Managed Cloud Service
  </h1>
  <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-xl">
    Focus on building AI features. We run the vector infrastructure: blazing-fast similarity search, high availability, and effortless scaling.
  </p>

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

        {/* Logos */}
        <section className="border-y bg-background/50">
          <div className="container mx-auto px-6 py-10">
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Trusted by teams building with AI
            </p>
            {/* <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center opacity-70"
                >
                  <img src="/placeholder-logo.svg" alt="Logo" className="h-8" />
                </div>
              ))}
            </div> */}
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="container mx-auto px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to ship vector search
              </h2>
              <p className="mt-3 text-muted-foreground">
                Production-ready features, zero ops.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Blazing performance",
                  desc: "Low-latency ANN across millions to billions of vectors.",
                },
                {
                  title: "Fully managed",
                  desc: "Backups, monitoring, upgrades, and failover handled for you.",
                },
                {
                  title: "Streaming ingest",
                  desc: "High-throughput writes with immediate query consistency.",
                },
                {
                  title: "Hybrid search",
                  desc: "Combine dense vectors with filters and keyword re-ranking.",
                },
                {
                  title: "Secure by default",
                  desc: "VPC peering, RBAC, audit logs, and encryption at rest & transit.",
                },
                {
                  title: "SDKs & tools",
                  desc: "TypeScript/Python clients, REST, and CLI for smooth developer UX.",
                },
              ].map((f) => (
                <Card key={f.title} className="p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    ★
                  </div>
                  <h3 className="text-lg font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

{/* How it works */}
<section className="bg-muted/20 py-20">
  <div className="container mx-auto px-6 text-center max-w-2xl">
    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
      From zero to search in minutes
    </h2>
    <p className="mt-4 text-muted-foreground text-sm sm:text-base">
      Create a database, ingest embeddings, and query with filters. All fully managed and production-ready.
    </p>

    <ol className="mt-6 list-disc list-inside space-y-2 text-sm text-muted-foreground">
      <li>Create a database instantly with your chosen region and capacity.</li>
      <li>Ingest embeddings via SDKs or REST API with high throughput.</li>
      <li>Query with filters for semantic search and fast results.</li>
      
    </ol>
    <div className="mt-6">
      <Link href="/signup">
        <Button size="lg" className="cursor-pointer">Start free</Button>
      </Link>
    </div>
  </div>
</section>
      </main>
      <PreLoginFooter />
    </>
  );
}
