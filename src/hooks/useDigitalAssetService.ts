import { useState, useEffect } from "react";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";
import { DigitalAssetService } from "../services/DigitalAssetService";
import { logger } from "../utils/logger";

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
          logger.debug("DigitalAssetService initialized", {
            hasToken: true,
          });
        } else {
          setService(null);
          logger.warn("DigitalAssetService not initialized: no access token");
        }
      } catch (error) {
        logger.error("Error initializing DigitalAssetService", error);
        setService(null);
      }
    };

    void initializeService();
  }, []);

  return service;
};
