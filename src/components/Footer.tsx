import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-primary">SentriSafe</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI-powered protection for women and girls online.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Features</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/detection" className="hover:text-primary transition-colors">Detection</Link></li>
              <li><Link to="/evidence" className="hover:text-primary transition-colors">Evidence Vault</Link></li>
              <li><Link to="/coach" className="hover:text-primary transition-colors">Safety Coach</Link></li>
              <li><Link to="/contacts" className="hover:text-primary transition-colors">Safe Circle</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/settings" className="hover:text-primary transition-colors">Settings</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground mb-1">© 2025 SentriSafe. All rights reserved.</p>
          <p className="text-xs text-primary italic">"Safety is not optional — it is designed."</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
