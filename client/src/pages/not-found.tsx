import { Link } from "wouter";
import { Leaf, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="bg-card p-8 rounded-3xl shadow-lg border border-border/50 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">404</h1>
          <h2 className="text-xl font-bold text-foreground mt-2">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Looks like you've wandered off the path!
          </p>
        </div>

        <Link href="/" className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity gap-2">
          <Leaf className="w-5 h-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
