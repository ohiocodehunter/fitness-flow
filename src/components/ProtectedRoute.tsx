import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse-glow rounded-full bg-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}