// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../types/auth.type";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Agar user login hai aur login page par jana chahta hai, to dashboard bhej dein
      if (isLoginPage) {
        navigate("/", { replace: true });
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [isLoginPage, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    // Redirect to auth page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
