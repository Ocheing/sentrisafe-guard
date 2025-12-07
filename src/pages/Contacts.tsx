import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, Users, Trash2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  contact_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
}

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("trusted_contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setContacts(data);
    }
  };

  const addContact = async () => {
    if (!formData.name || (!formData.phone && !formData.email)) {
      toast.error("Please provide name and at least one contact method");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("trusted_contacts").insert([{
      contact_name: formData.name,
      contact_phone: formData.phone || null,
      contact_email: formData.email || null,
      user_id: user.id,
    }]);

    if (error) {
      toast.error("Failed to add contact");
    } else {
      toast.success("Contact added to your safe circle");
      setFormData({ name: "", phone: "", email: "" });
      setShowForm(false);
      fetchContacts();
    }
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("trusted_contacts").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete contact");
    } else {
      toast.success("Contact removed");
      fetchContacts();
    }
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
                <Users className="w-8 h-8" />
                Safe Contact Circle
              </h1>
              <p className="text-muted-foreground mt-1">
                Trusted people who receive your SOS alerts
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {showForm && (
          <Card className="mb-6 border-2 border-primary/30">
            <CardHeader>
              <CardTitle>Add Trusted Contact</CardTitle>
              <CardDescription>
                This person will be notified when you activate SOS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={addContact} className="flex-1 bg-primary">
                  Save Contact
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {contacts.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Contacts Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add trusted contacts who will be notified in case of emergency
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {contact.contact_name}
                      </h3>
                      <div className="space-y-2">
                        {contact.contact_phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{contact.contact_phone}</span>
                          </div>
                        )}
                        {contact.contact_email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{contact.contact_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContact(contact.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
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

export default Contacts;
