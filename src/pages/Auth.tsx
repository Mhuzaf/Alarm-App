
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlarmClock } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/auth?reset=true",
        });
        
        if (error) throw error;
        
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: email.split('@')[0] // Optional: create a default username
            }
          }
        });
        
        if (error) throw error;
        
        // Since email verification is disabled, we should have a session immediately
        // Check if we have a session and redirect if we do
        if (data.session) {
          toast.success("Account created successfully!");
          navigate("/");
        } else {
          // Fallback in case verification is still enabled
          toast.success("Account created! You can now sign in.");
          setIsSignUp(false); // Switch to sign in mode
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth?reset=true",
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent! Check your inbox.");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form states
  const resetFormState = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <AlarmClock className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold mt-2">
            {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isForgotPassword 
              ? "Enter your email to receive a password reset link" 
              : isSignUp 
                ? "Sign up to save your alarms" 
                : "Sign in to access your alarms"}
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-primary hover:underline"
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        )}

        {!isForgotPassword && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
