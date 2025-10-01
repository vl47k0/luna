import {
  User,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";

const AUTHORITY =
  process.env.REACT_APP_AUTHORITY ??
  "https://default-authority.example.com/oauth";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? "fallback-client-id";
const REDIRECT_URI =
  process.env.REACT_APP_REDIRECT_URI ?? "http://localhost:3000/luna/token";
const SCOPE =
  process.env.REACT_APP_SCOPE ?? "openid email profile offline_access";
const RESPONSE_TYPE = process.env.REACT_APP_RESPONSE_TYPE ?? "code";

const config: UserManagerSettings = {
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  scope: SCOPE,
  response_type: RESPONSE_TYPE,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  // Corrected property names and disabled loadUserInfo
  silentRequestTimeoutInSeconds: 10,
  monitorSession: true,
  loadUserInfo: false, // Set to false to prevent userinfo endpoint error
  revokeTokensOnSignout: true, // Corrected from revokeAccessTokenOnSignout

  // Add silent redirect URI for silent token renewal
  silent_redirect_uri: window.location.origin + "/luna/silent-refresh.html",
};

class AuthService {
  private userManager: UserManager;
  private renewingToken: boolean = false;

  constructor() {
    this.userManager = new UserManager(config);

    // Set up event handlers for token management
    this.userManager.events.addAccessTokenExpiring(() => {
      console.log("Access token expiring, attempting silent renewal");
      void this.renewToken();
    });

    this.userManager.events.addSilentRenewError((error) => {
      console.error("Silent renew error:", error);
      // Redirect to login if silent renewal fails
      void this.signIn().catch(console.error);
    });

    this.userManager.events.addUserLoaded((user: User) => {
      console.log("User loaded", user);
    });
  }

  public signIn(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public async signOut(): Promise<void> {
    await this.userManager.signoutRedirect();
  }

  public async getUser(): Promise<User | null> {
    const user = await this.userManager.getUser();

    // If we have a user but the token is about to expire, try to renew it
    if (user && this.isTokenExpiringSoon(user)) {
      return await this.renewToken();
    }

    return user;
  }

  private isTokenExpiringSoon(user: User): boolean {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = user.expires_at ? user.expires_at - now : 0;
    // Renew if token expires in less than 5 minutes
    return expiresIn < 300;
  }

  private async renewToken(): Promise<User | null> {
    // Prevent multiple simultaneous token renewals
    if (this.renewingToken) {
      return this.userManager.getUser();
    }

    try {
      this.renewingToken = true;
      const user = await this.userManager.signinSilent();
      console.log("Token renewed successfully");
      return user;
    } catch (error) {
      console.error("Failed to renew token silently:", error);
      return null;
    } finally {
      this.renewingToken = false;
    }
  }

  public async handleRedirectCallback(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      console.log("Successfully processed redirect callback");
      return user;
    } catch (error) {
      console.error("Error handling redirect callback", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
