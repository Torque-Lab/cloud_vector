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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/40 to-background" />
          <div className="container mx-auto px-6 py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                  Powered vector search, made simple
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Managed Vector Database Cloud
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg">
                  Focus on building AI features. We run the vector
                  infrastructure: blazing-fast similarity search, high
                  availability, and effortless scaling.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get started free
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Sign in
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
                  <div>99.99% uptime</div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <div>Global regions</div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <div>Pay as you grow</div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent blur-2xl" />
                <Card className="overflow-hidden">
                  <div className="aspect-[16/10] w-full bg-muted">
                    <img
                      src="/placeholder.jpg"
                      alt="Vector Cloud screenshot"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="border-y bg-background/50">
          <div className="container mx-auto px-6 py-10">
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Trusted by teams building with AI
            </p>
            <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center opacity-70"
                >
                  <img src="/placeholder-logo.svg" alt="Logo" className="h-8" />
                </div>
              ))}
            </div>
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
        <section className="bg-muted/20">
          <div className="container mx-auto px-6 py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  From zero to search in minutes
                </h2>
                <ol className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      1
                    </span>
                    <div>
                      <div className="font-medium">Create a database</div>
                      <div className="text-muted-foreground">
                        Pick a region and capacity. We provision instantly.
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      2
                    </span>
                    <div>
                      <div className="font-medium">Ingest embeddings</div>
                      <div className="text-muted-foreground">
                        Use our SDKs or REST API to write vectors and metadata.
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      3
                    </span>
                    <div>
                      <div className="font-medium">Query with filters</div>
                      <div className="text-muted-foreground">
                        Serve semantic search, RAG, and recommendations with ms
                        latency.
                      </div>
                    </div>
                  </li>
                </ol>
                <div className="mt-6 flex gap-3">
                  <Link href="/auth/signup">
                    <Button>Start free</Button>
                  </Link>
                  <Link href="/projects">
                    <Button variant="ghost">Explore console →</Button>
                  </Link>
                </div>
              </div>
              <Card className="overflow-hidden">
                <div className="aspect-[16/10] w-full bg-muted">
                  <img
                    src="/placeholder.svg"
                    alt="How it works"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="container mx-auto px-6 py-20">
            <Card className="mx-auto max-w-5xl">
              <div className="grid gap-8 p-8 sm:p-10 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="text-2xl font-semibold">
                    Build with vectors, not servers
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try it free with generous limits. No credit card required.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Create account
                    </Button>
                  </Link>
                  <Link href="/usage/plans">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      View pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <PreLoginFooter />
    </>
  );
}
