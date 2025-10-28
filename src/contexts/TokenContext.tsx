import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
} from "react";

interface TokenContextValue {
  getToken: () => string;
}

const TokenContext = createContext<TokenContextValue | null>(null);

export const TokenProvider: React.FC<{
  token: string;
  children: React.ReactNode;
}> = ({ token, children }) => {
  const tokenRef = useRef(token);

  useEffect(() => {
    if (tokenRef.current !== token) {
      console.log("🔐 TokenContext: Token updated silently");
      tokenRef.current = token;
    }
  }, [token]);

  const value = useMemo(
    () => ({
      getToken: () => tokenRef.current,
    }),
    []
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

export const useToken = (): string => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within TokenProvider");
  }
  return context.getToken();
};
