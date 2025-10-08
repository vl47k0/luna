import { useState, useEffect } from "react";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";
import { DigitalAssetService } from "../services/DigitalAssetService";

export const useDigitalAssetService = (): DigitalAssetService | null => {
  const [service, setService] = useState<DigitalAssetService | null>(null);

  useEffect(() => {
    const initializeService = async (): Promise<void> => {
      try {
        const user: User | null = await authService.getUser();
        if (user?.access_token) {
          const digitalAssetService = new DigitalAssetService({
            token: user.access_token,
          });
          setService(digitalAssetService);
        } else {
          setService(null);
        }
      } catch (error) {
        console.error("Error initializing DigitalAssetService:", error);
        setService(null);
      }
    };

    void initializeService();
  }, []);

  return service;
};
