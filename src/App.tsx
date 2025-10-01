import Routing from "./Routing";
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { authService } from "./utils/oidc";
import { User } from "oidc-client-ts";

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async (): Promise<void> => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    void checkUser();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {user && <Sidebar />}
      <Routing />
    </Box>
  );
};

export default App;
