import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Scan, FileText, MessageSquare, Users, AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary">SentriSafe</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => navigate("/auth")} size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center max-w-3xl">
        <div className="mb-6">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Digital Safety Guardian
          </h1>
          <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto">
            AI-powered protection against online violence. Real-time detection, secure evidence storage, and emergency support.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="default"
            className="bg-primary hover:bg-primary/90 h-10 px-6"
          >
            Start Protecting Yourself
          </Button>
        </div>
        <p className="text-xs text-primary font-semibold italic">
          "Safety is not optional — it is designed."
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-10 max-w-5xl flex-1">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Complete Protection Suite
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <Scan className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">AI Detection</h3>
              <p className="text-xs text-muted-foreground">
                Detect harassment, threats, grooming, and more with advanced AI.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">Evidence Vault</h3>
              <p className="text-xs text-muted-foreground">
                Securely store harmful content with encrypted protection.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <AlertTriangle className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">SOS Emergency</h3>
              <p className="text-xs text-muted-foreground">
                One-tap alert notifies your trusted contacts instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">Safety Coach</h3>
              <p className="text-xs text-muted-foreground">
                AI-powered guidance on digital safety strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">Safe Circle</h3>
              <p className="text-xs text-muted-foreground">
                Build your trusted network for emergency alerts.
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-4 pb-4">
              <Shield className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-base font-semibold mb-1 text-foreground">Real-time Protection</h3>
              <p className="text-xs text-muted-foreground">
                Monitor your safety score and get instant alerts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            How SentriSafe Works
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: "1", title: "Scan Messages", desc: "Analyze messages for harmful content before viewing." },
              { num: "2", title: "Get Alerts", desc: "Receive risk scores and detailed categorization." },
              { num: "3", title: "Save Evidence", desc: "Store harmful content securely in your vault." },
              { num: "4", title: "Stay Protected", desc: "Use SOS alerts and AI coach for ongoing protection." },
            ].map((step) => (
              <div key={step.num} className="flex gap-3 bg-card p-4 rounded-lg border">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1 text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-10 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Ready to Take Control?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Join SentriSafe today and experience peace of mind online.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-primary hover:bg-primary/90 h-10 px-6"
        >
          Create Your Account
        </Button>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
