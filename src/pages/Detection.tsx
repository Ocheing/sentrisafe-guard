import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Shield, FileText } from "lucide-react";
import { toast } from "sonner";

interface DetectionResult {
  category: string;
  riskScore: number;
  isHarmful: boolean;
  recommendedAction: string;
  highlightedText?: string;
}

const Detection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const analyzeMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to analyze");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI detection with keyword matching
    const keywords = {
      harassment: ["stupid", "idiot", "hate you", "loser", "ugly"],
      threats: ["kill", "hurt", "destroy", "attack", "harm"],
      grooming: ["secret", "don't tell", "special friend", "meet alone"],
      sexual: ["nude", "sexy", "body", "private parts"],
      doxxing: ["address", "phone number", "live at", "school at"],
      hate: ["racist", "discriminat", "inferior", "deserve to die"],
    };

    let category = "Safe";
    let riskScore = 0;
    let isHarmful = false;

    const lowerMessage = message.toLowerCase();

    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
        riskScore = Math.floor(Math.random() * 30) + 70; // 70-100 for harmful
        isHarmful = true;
        break;
      }
    }

    if (!isHarmful) {
      riskScore = Math.floor(Math.random() * 20) + 5; // 5-25 for safe
    }

    const detectionResult: DetectionResult = {
      category,
      riskScore,
      isHarmful,
      recommendedAction: isHarmful
        ? "Block sender, save evidence, and consider reporting"
        : "Message appears safe to view",
    };

    setResult(detectionResult);
    setIsAnalyzing(false);

    // Create alert if harmful
    if (isHarmful) {
      await supabase.from("safety_alerts").insert({
        alert_type: "detection",
        message: `Detected ${category.toLowerCase()} content`,
        risk_level: riskScore > 80 ? "high" : "medium",
        user_id: user?.id,
      });
    }
  };

  const saveEvidence = async () => {
    if (!result || !result.isHarmful) return;

    try {
      await supabase.from("evidence").insert({
        user_id: user?.id,
        content: message,
        category: result.category,
        risk_score: result.riskScore,
        platform: "Manual Scan",
      });
      toast.success("Evidence saved to your vault");
    } catch (error) {
      toast.error("Failed to save evidence");
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-danger";
    if (score >= 50) return "text-warning";
    return "text-success";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary">Message Detection</h1>
          <p className="text-muted-foreground mt-1">
            Analyze messages for harmful content before viewing
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle>Enter Message to Analyze</CardTitle>
            <CardDescription>
              Paste or type the message you want to check for safety
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="border-2 resize-none"
            />
            <Button
              onClick={analyzeMessage}
              disabled={isAnalyzing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Message"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 ${result.isHarmful ? "border-danger/50 bg-danger/5" : "border-success/50 bg-success/5"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {result.isHarmful ? (
                    <AlertTriangle className="w-6 h-6 text-danger" />
                  ) : (
                    <Shield className="w-6 h-6 text-success" />
                  )}
                  Detection Results
                </CardTitle>
                <Badge
                  variant={result.isHarmful ? "destructive" : "default"}
                  className="text-lg px-4 py-1"
                >
                  {result.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Risk Score</div>
                <div className="flex items-center gap-4">
                  <div className={`text-5xl font-bold ${getRiskColor(result.riskScore)}`}>
                    {result.riskScore}
                  </div>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${result.riskScore >= 80 ? "bg-danger" : result.riskScore >= 50 ? "bg-warning" : "bg-success"}`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="font-semibold mb-2">Recommended Action:</div>
                <p className="text-foreground">{result.recommendedAction}</p>
              </div>

              {result.isHarmful && (
                <div className="flex gap-3">
                  <Button
                    onClick={saveEvidence}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Evidence
                  </Button>
                  <Button
                    onClick={() => setMessage("")}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear & Scan New
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Detection Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Harassment",
                "Hate Speech",
                "Threats",
                "Grooming",
                "Sexual Content",
                "Doxxing",
              ].map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Detection;
