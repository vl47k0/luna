import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { logger } from "../utils/logger";

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  id_token: string;
}

export interface IIdToken {
  sub?: string;
  aud?: string;
  auth_time?: number;
  domain?: string;
  iss?: string;
  preferred_username?: string;
  customdata?: {
    sub?: string;
    preferred_username?: string;
    auth_time?: number;
  };
  exp?: number;
  iat?: number;
  email?: string;
}

export interface IAccessToken {
  sub?: string;
  aud?: string;
  domain?: string;
  scope?: string;
  iss?: string;
  exp?: number;
  iat?: number;
  jti?: string;
}

export interface IRefreshToken {
  sub?: string;
  aud?: string;
  domain?: string;
  scope?: string;
  iss?: string;
  exp?: number;
  iat?: number;
  jti?: string;
}

export interface IUserData {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  expirationDate: string;
  AccessToken: IAccessToken;
  RefreshToken: IRefreshToken;
  IdToken: IIdToken;
}

export interface IJWK {
  kty: string;
  use: string;
  alg: string;
  kid: string;
  x5c: string[];
  "x5t#S256": string;
  e: string;
  n: string;
}

export interface IJWKSet {
  keys: IJWK[];
}

export interface CoreMasterUser {
  id?: string | null;
  sub?: string | null;
  username?: string | null;
  preferred_username?: string | null;
  email?: string;
  password?: string;
  roles?: string[];
}

const axiosBackend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

class AuthService {
  login(username: string, password: string): Promise<IUserData> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_SOD_SEC}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const data = new URLSearchParams({
      grant_type: "password",
      username: username,
      password: password,
      scope: "openid profile",
    });

    return axios
      .post<ILoginResponse>(
        `${axiosBackend.defaults.baseURL}am/a2b-develop/oauth/token/`,
        data,
        config
      )
      .then((response) => {
        const { access_token, refresh_token, id_token, expires_in } =
          response.data;
        const expirationDate = new Date(
          new Date().getTime() + expires_in * 1000
        ).toISOString();

        const userData: IUserData = {
          ...response.data,
          expirationDate: expirationDate,
          AccessToken: jwtDecode<IAccessToken>(access_token),
          RefreshToken: jwtDecode<IRefreshToken>(refresh_token),
          IdToken: jwtDecode<IIdToken>(id_token),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      });
  }

  decodeJwt(token: string): { exp: number } | null {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded;
    } catch (error) {
      logger.error("Failed to decode JWT", error, {
        tokenPreview: token.slice(0, 12),
      });
      return null;
    }
  }

  async revokeToken(token: string): Promise<AxiosResponse<unknown>> {
    const data = new URLSearchParams();
    data.append("token", token);

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_SOD_SEC}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    return axios.post(
      axiosBackend.defaults.baseURL + "/oauth/revoke",
      data,
      config
    );
  }

  async refToken(): Promise<IUserData> {
    const user = this.getCurrentUser();
    if (!user?.refresh_token) {
      logger.error("No refresh token available", undefined, {
        method: "refToken",
      });
      return Promise.reject("No refresh token available");
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_SOD_SEC}`,
      },
    };

    try {
      const response = await axios.get<IUserData>(
        `${axiosBackend.defaults.baseURL}oauth/token?client_id=dd0a8573-e9d7-4466-8a85-73e9d7246681&grant_type=refresh_token&login_type=gravitee&refresh_token=${user.refresh_token}`,
        config
      );

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      logger.error("Error refreshing token", error, {
        method: "refToken",
      });
      return Promise.reject(error);
    }
  }

  refreshToken(): Promise<IUserData> {
    const user = this.getCurrentUser();
    if (!user?.refresh_token) {
      logger.warn("No refresh token available", { method: "refreshToken" });
      return Promise.reject("No refresh token available");
    }

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_SOD_SEC}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const data = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: user.refresh_token,
    });

    return axios
      .post<IUserData>(
        `${axiosBackend.defaults.baseURL}oauth/token/`,
        data,
        config
      )
      .then((response) => {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  isAccessTokenExpiring(): boolean {
    const user = this.getCurrentUser();
    if (!user?.access_token) {
      logger.warn("No access token available", {
        method: "isAccessTokenExpiring",
      });
      return true;
    }

    const decoded = this.decodeJwt(user.access_token);
    if (!decoded?.exp) {
      logger.warn("Failed to decode access token or no exp claim", {
        method: "isAccessTokenExpiring",
      });
      return true;
    }

    const currentTime = Date.now() / 1000;
    const expTime = decoded.exp;
    const isExpiringSoon = expTime - currentTime < 300;

    return isExpiringSoon;
  }

  async refreshTokenIfNeeded(): Promise<IUserData | null> {
    if (this.isAccessTokenExpiring()) {
      logger.info("Access token is about to expire, refreshing");
      return this.refreshToken();
    } else {
      logger.debug("Access token is valid");
      return Promise.resolve(null);
    }
  }

  logout(): void {
    const user = this.getCurrentUser();
    if (!user?.id_token) {
      logger.error("No ID token available for logout");
      return;
    }

    const logoutUrl = `${
      axiosBackend.defaults.baseURL
    }am/a2b-develop/logout?id_token_hint=${
      user.id_token
    }&post_logout_redirect_uri=${encodeURIComponent(
      "YOUR_POST_LOGOUT_REDIRECT_URI"
    )}`;
    logger.debug("Generated logout URL", { logoutUrl });
    localStorage.removeItem("user");
  }

  async getJWKs(): Promise<IJWKSet | null> {
    try {
      const response = await axios.get<IJWKSet>(
        `${axiosBackend.defaults.baseURL}am/a2b-develop/oidc/.well-known/jwks.json`
      );
      const jwks = response.data;
      logger.debug("Fetched JWKs", { keyCount: jwks.keys.length });
      return jwks;
    } catch (error) {
      logger.error("Failed to fetch JWKs", error);
      return null;
    }
  }

  getCurrentUser(): IUserData | null {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr) as IUserData;

    return null;
  }
}

export default new AuthService();
