import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DisguiseProvider } from "@/contexts/DisguiseContext";
import { SOSProvider } from "@/contexts/SOSContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Detection from "./pages/Detection";
import Evidence from "./pages/Evidence";
import Coach from "./pages/Coach";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SOSButton from "./components/SOSButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DisguiseProvider>
        <SOSProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SOSButton />
          </BrowserRouter>
        </SOSProvider>
      </DisguiseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
