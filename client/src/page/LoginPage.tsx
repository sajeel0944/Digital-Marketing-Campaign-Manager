import { Login } from "../components/auth/Login";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { user } = useAuth();

  if (user?.token) {
    window.location.href = "/";
    return null;
  }

  return <Login />;
}
