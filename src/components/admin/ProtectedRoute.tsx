import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "@/integrations/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      await checkAdmin(user.uid);
    });

    return () => unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const userRolesRef = collection(db, "userRoles");
      const q = query(
        userRolesRef,
        where("userId", "==", userId),
        where("role", "==", "admin")
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No admin role found');
        setIsAdmin(false);
      } else {
        console.log('Admin role verified!');
        setIsAdmin(true);
      }
    } catch (error: any) {
      console.error("Error checking admin:", error);
      console.error("Error code:", error.code);
      
      if (error.code === 'permission-denied') {
        console.error('⚠️  Firestore permission denied! Configure security rules in Firebase Console.');
      }
      
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
