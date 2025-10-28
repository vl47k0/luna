import Routing from "./Routing";
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";
import React from "react";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      {user && <Sidebar />}
      <Routing />
    </Box>
  );
};

export default App;
