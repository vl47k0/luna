import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useAuth, useUser } from "../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const user = useUser();
  const { loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect((): void => {
    console.log(location);
  }, [location]);

  useEffect((): void => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{user && <Dashboard />}</>;
};

export default Sidebar;
