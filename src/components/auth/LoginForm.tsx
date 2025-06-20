
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";

export function LoginForm() {
  const { userType } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  // Temporarily redirect all non-senior user types to senior login
  if (userType && userType !== 'senior') {
    return <Navigate to="/login/senior" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Link>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-xl text-gray-600">
            Access your medication dashboard
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-lg p-6"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-lg">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg p-6"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full text-xl py-6"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center space-y-2">
          <Button variant="link" asChild className="text-lg">
            <Link to="/forgot-password">Forgot your password?</Link>
          </Button>
          <p className="text-lg text-gray-600">
            Don't have an account?{" "}
            <Button variant="link" asChild className="text-lg">
              <Link to={`/signup/senior`}>Sign up</Link>
            </Button>
          </p>
        </div>
      </div>
    </form>
  );
}
