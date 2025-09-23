import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Zap, MessageSquare, Server, Play, Sparkles, CloudDrizzle } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Server,
    name: "Virtual Machines",
    description: "Launch powerful compute instances in seconds",
    delay: "0ms"
  },
  {
    icon: Database,
    name: "PostgreSQL",
    description: "Bulletproof managed databases",
    delay: "150ms"
  },
  {
    icon: Zap,
    name: "Redis",
    description: "Lightning-fast caching layer",
    delay: "300ms"
  },
  {
    icon: MessageSquare,
    name: "RabbitMQ",
    description: "Reliable message queues",
    delay: "450ms"
  },
];

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header with organic spacing */}
          <div className="text-left max-w-4xl mb-20">
            <Badge 
              variant="secondary" 
              className="mb-8 px-4 py-2 text-sm font-medium border border-cloud-emerald/20 bg-cloud-emerald/5 text-cloud-emerald animate-slide-up"
            >
              <CloudDrizzle className="w-4 h-4 mr-2" />
              Built on Google Cloud Platform
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-light mb-8 leading-[0.9] animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="font- text-foreground">Cloud infrastructure</span>
              <br />
              <span className="bg-gradient-text bg-clip-text  font-medium">without the</span>
              <br />
              <span className="font-light text-muted-foreground italic">complexity</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl font-light leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Deploy VMs, PostgreSQL, Redis, and RabbitMQ with a few clicks. 
              All the enterprise power you need, none of the enterprise pain you don't.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                className=" px-8 py-6 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                asChild
              >
                <Link href="/signup">
                <Play className="w-5 h-5 mr-2"/>
                Start building
                <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="px-8 py-6 text-lg font-medium rounded-2xl border-2 border-muted hover:border-cloud-emerald/30 hover:bg-cloud-emerald/5 transition-all duration-300 cursor-pointer"
                asChild
              >
                <Link href="/#docs">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore docs
                </Link>
              </Button>
            </div>
          </div>

          {/* Services - organic grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {services.map((service, index) => (
              <Card 
                key={service.name} 
                className={`group hover:scale-[1.02] transition-all duration-500 bg-card/60 backdrop-blur-sm border-2 border-border hover:border-cloud-emerald/30 rounded-3xl animate-slide-up`}
                style={{ animationDelay: service.delay }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16  border-2 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse-soft transition-all duration-300`}>
                    <service.icon className={`w-7 h-7`} />
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-foreground">{service.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Organic stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl md:text-5xl font-light ">99.9%</div>
              <div className="text-muted-foreground font-light">Reliability you can count on</div>
            </div>
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '1s' }}>
              <div className="text-4xl md:text-5xl font-light ">&lt; 2min</div>
              <div className="text-muted-foreground font-light">From idea to running code</div>
            </div>
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <div className="text-4xl md:text-5xl font-light ">24/7</div>
              <div className="text-muted-foreground font-light">Agent support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

