import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/integrations/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting login with:', email);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Authentication successful:', user.uid);

      // Check if user is admin
      const userRolesRef = collection(db, "userRoles");
      const q = query(
        userRolesRef,
        where("userId", "==", user.uid),
        where("role", "==", "admin")
      );
      
      console.log('Checking admin role...');
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await auth.signOut();
        throw new Error("Unauthorized: Not an admin user");
      }

      console.log('Admin role verified!');
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      navigate("/admin");
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      
      let errorMessage = error.message;
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Firestore permission denied. Please configure Firestore security rules in Firebase Console.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <Card className="w-full max-w-md relative z-10 border-primary/20 bg-background/95 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center mb-4 mx-auto">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your portfolio content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-gold-dark hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
