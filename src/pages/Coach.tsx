import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  message: string;
  created_at: string;
}

const Coach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    const { data } = await supabase
      .from("coach_conversations")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save user message
    const { data: userData } = await supabase
      .from("coach_conversations")
      .insert({ role: "user", message: userMessage, user_id: user.id })
      .select()
      .single();

    if (userData) {
      setMessages((prev) => [...prev, userData as Message]);
    }

    // Simulate AI response with safety tips
    const responses = [
      "Remember to never share personal information like your address or phone number with strangers online.",
      "If someone makes you feel uncomfortable, it's okay to block them and tell a trusted adult.",
      "Use strong, unique passwords for each account. Consider using a password manager.",
      "Be cautious of friend requests from people you don't know in real life.",
      "Trust your instincts - if something feels wrong, it probably is. Always prioritize your safety.",
      "Keep your privacy settings strict on social media. Not everyone needs to see everything you post.",
      "Report and document any harassment or threatening behavior. You have the right to feel safe online.",
    ];

    const aiResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(async () => {
      const { data: aiData } = await supabase
        .from("coach_conversations")
        .insert({ role: "assistant", message: aiResponse, user_id: user.id })
        .select()
        .single();

      if (aiData) {
        setMessages((prev) => [...prev, aiData as Message]);
      }
      setLoading(false);
    }, 1000);
  };

  const quickTips = [
    "How to spot grooming?",
    "What is cyberbullying?",
    "Privacy settings guide",
    "Reporting abuse",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Digital Safety Coach
          </h1>
          <p className="text-muted-foreground mt-1">
            Get personalized safety advice and guidance
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="border-2 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-center">Welcome to Safety Coach!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  I'm here to help you stay safe online. Ask me anything about digital safety!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {quickTips.map((tip) => (
                    <Button
                      key={tip}
                      variant="outline"
                      onClick={() => setInput(tip)}
                      className="h-auto py-3 text-left justify-start"
                    >
                      {tip}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border-2 border-border text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border-2 border-border rounded-2xl px-4 py-3">
                  <p className="text-sm text-muted-foreground">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Ask about digital safety..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="border-2"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 shrink-0"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Coach;
