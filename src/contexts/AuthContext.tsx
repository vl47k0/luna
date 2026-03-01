import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";
import { logger } from "../utils/logger";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  getToken: () => string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTokenRefresh = useCallback((expiresAt: number) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = expiresAt - now;
    const refreshIn = Math.max(expiresIn - 300, 60);

    logger.debug("Scheduling token refresh", {
      refreshInSeconds: refreshIn,
      refreshInMinutes: Math.floor(refreshIn / 60),
      expiresAt,
    });

    refreshTimerRef.current = setTimeout(() => {
      logger.debug("Token refresh timer triggered");
      void refreshToken();
    }, refreshIn * 1000);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      logger.info("Refreshing token");
      const refreshedUser = await authService.renewToken();
      if (refreshedUser) {
        setUser(refreshedUser);
        tokenRef.current = refreshedUser.access_token;
        if (refreshedUser.expires_at) {
          scheduleTokenRefresh(refreshedUser.expires_at);
        }
        logger.info("Token refreshed successfully", {
          expiresAt: refreshedUser.expires_at,
        });
      } else {
        logger.error("Token refresh returned null");
        await signOut();
      }
    } catch (error) {
      logger.error("Token refresh failed", error);
      await signOut();
    }
  }, [scheduleTokenRefresh]);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getUser();
      if (currentUser) {
        setUser(currentUser);
        tokenRef.current = currentUser.access_token;
        if (currentUser.expires_at) {
          scheduleTokenRefresh(currentUser.expires_at);
        }
        logger.info("User loaded successfully", {
          expiresAt: currentUser.expires_at,
          profileSub: currentUser.profile?.sub,
        });
      } else {
        logger.warn("No user found during auth bootstrap");
      }
    } catch (error) {
      logger.error("Failed to load user", error);
    } finally {
      setLoading(false);
    }
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    void loadUser();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [loadUser]);

  const signIn = useCallback(async () => {
    await authService.signIn();
  }, []);

  const signOut = useCallback(async () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setUser(null);
    tokenRef.current = null;
    await authService.signOut();
  }, []);

  const getToken = useCallback((): string | null => {
    return tokenRef.current;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    getToken,
    signIn,
    signOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useUser = (): User | null => {
  const { user } = useAuth();
  return user;
};

export const useToken = (): string | null => {
  const { getToken } = useAuth();
  return getToken();
};
