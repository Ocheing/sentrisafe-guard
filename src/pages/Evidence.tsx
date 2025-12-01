import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";

interface Evidence {
  id: string;
  content: string;
  category: string;
  risk_score: number;
  platform: string;
  created_at: string;
}

const Evidence = () => {
  const navigate = useNavigate();
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchEvidence();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchEvidence = async () => {
    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load evidence");
    } else {
      setEvidenceList(data || []);
    }
    setLoading(false);
  };

  const deleteEvidence = async (id: string) => {
    const { error } = await supabase.from("evidence").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete evidence");
    } else {
      toast.success("Evidence deleted");
      fetchEvidence();
    }
  };

  const exportEvidence = () => {
    const dataStr = JSON.stringify(evidenceList, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sentrisafe-evidence-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Evidence exported successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Lock className="w-8 h-8" />
                Evidence Vault
              </h1>
              <p className="text-muted-foreground mt-1">
                Securely stored harmful content for reporting
              </p>
            </div>
            <Button onClick={exportEvidence} disabled={evidenceList.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading evidence...</div>
          </div>
        ) : evidenceList.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Evidence Stored</h3>
              <p className="text-muted-foreground mb-4">
                When you detect harmful content, you can save it here for future reference
              </p>
              <Button onClick={() => navigate("/detection")} className="bg-primary">
                Start Scanning Messages
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evidenceList.map((evidence) => (
              <Card key={evidence.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="destructive">{evidence.category}</Badge>
                        <Badge variant="outline">{evidence.platform || "Unknown"}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Risk Score: <span className="font-bold text-danger">{evidence.risk_score}</span>
                        </span>
                      </div>
                      <CardDescription>
                        {new Date(evidence.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEvidence(evidence.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg border border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {evidence.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Evidence;
