import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Scan, FileText, MessageSquare, Users, AlertTriangle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
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
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">SentriSafe</h1>
          </div>
          <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center max-w-4xl">
        <div className="mb-8">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
              <Shield className="w-14 h-14 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Your Digital Safety Guardian
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered protection against online violence. Real-time detection, secure evidence storage, and emergency support for women and girls.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg h-14 px-8"
            >
              Start Protecting Yourself
            </Button>
          </div>
        </div>

        <p className="text-sm text-primary font-semibold italic mt-8">
          "Safety is not optional — it is designed."
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Complete Protection Suite
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Scan className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">AI Detection</h3>
              <p className="text-muted-foreground">
                Scan messages before viewing. Detect harassment, threats, grooming, and more with advanced AI.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Evidence Vault</h3>
              <p className="text-muted-foreground">
                Securely store harmful content with encrypted protection. Export for legal purposes when needed.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <AlertTriangle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">SOS Emergency</h3>
              <p className="text-muted-foreground">
                One-tap alert system notifies your trusted contacts instantly in dangerous situations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Safety Coach</h3>
              <p className="text-muted-foreground">
                AI-powered guidance on digital safety, cyberbullying prevention, and online protection strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Safe Circle</h3>
              <p className="text-muted-foreground">
                Build your trusted network. Add contacts who will be alerted during emergencies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-foreground">Real-time Protection</h3>
              <p className="text-muted-foreground">
                Monitor your safety score and get instant alerts about potential threats in your messages.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How SentriSafe Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Scan Messages</h3>
                <p className="text-muted-foreground">
                  Paste or upload messages to analyze them for harmful content before viewing. Our AI checks for multiple threat types.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Get Instant Alerts</h3>
                <p className="text-muted-foreground">
                  Receive risk scores and detailed categorization. Know exactly what type of threat you're dealing with.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Save Evidence</h3>
                <p className="text-muted-foreground">
                  Store harmful content securely in your encrypted vault. Export when needed for reporting or legal purposes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Stay Protected</h3>
                <p className="text-muted-foreground">
                  Use SOS alerts, get AI coach guidance, and maintain your safe contact circle for ongoing protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-6 text-foreground">
          Ready to Take Control of Your Digital Safety?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join SentriSafe today and experience peace of mind online. Free to start, always protecting.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-lg h-14 px-8"
        >
          Create Your Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2025 SentriSafe. All rights reserved.</p>
          <p className="text-sm">Protecting women and girls from online violence with AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
