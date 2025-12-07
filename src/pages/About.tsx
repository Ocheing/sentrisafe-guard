import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  ArrowLeft, 
  Heart, 
  Users, 
  Lock, 
  Eye, 
  MessageCircle,
  Target
} from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-primary text-lg">SentriSafe</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">About SentriSafe</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering women and girls with AI-powered protection against online harassment, 
            threats, and digital abuse.
          </p>
        </section>

        {/* Mission Section */}
        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Our Mission</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SentriSafe was created with a singular purpose: to make the digital world safer 
                for women and girls. We believe everyone deserves to navigate online spaces 
                without fear of harassment, manipulation, or abuse. Our AI-powered tools detect 
                threats, preserve evidence, and provide guidance—putting safety back in your hands.
              </p>
            </div>
          </div>
        </Card>

        {/* Values Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">Empathy First</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    We understand the emotional toll of online abuse. Every feature is designed 
                    with compassion and care.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">Privacy Protected</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Your data is encrypted and secure. We never share your information 
                    without your explicit consent.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">Transparency</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    We're open about how our AI works and what we do with your data. 
                    No hidden agendas.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">Community Driven</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Built by women, for women. Our team listens to user feedback to 
                    continuously improve.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">How SentriSafe Helps</h2>
          <div className="space-y-3">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm">Threat Detection</h3>
                <p className="text-muted-foreground text-xs">AI-powered analysis of messages to identify harassment and threats</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm">Evidence Vault</h3>
                <p className="text-muted-foreground text-xs">Securely store and organize evidence for legal or support purposes</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm">Safety Coach</h3>
                <p className="text-muted-foreground text-xs">24/7 AI guidance on handling difficult online situations</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm">Safe Circle</h3>
                <p className="text-muted-foreground text-xs">Connect with trusted contacts for SOS alerts when you need help</p>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold text-foreground mb-2">Ready to Stay Safe?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Join thousands of women who trust SentriSafe for their digital safety.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
