import {
  User,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
} from 'oidc-client-ts';

const AUTHORITY =
  process.env.REACT_APP_AUTHORITY ??
  'https://default-authority.example.com/oauth';
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? 'fallback-client-id';
const REDIRECT_URI =
  process.env.REACT_APP_REDIRECT_URI ?? 'http://localhost:3000/luna/token';
const SCOPE =
  process.env.REACT_APP_SCOPE ?? 'openid email profile offline_access';
const RESPONSE_TYPE = process.env.REACT_APP_RESPONSE_TYPE ?? 'code';

const config: UserManagerSettings = {
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  scope: SCOPE,
  response_type: RESPONSE_TYPE,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  loadUserInfo: false,
};

class AuthService {
  private userManager: UserManager;

  constructor() {
    this.userManager = new UserManager(config);
    this.userManager.events.addUserLoaded((user: User) => {
      console.log('User loaded', user);
    });
  }

  public signIn(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public async signOut(): Promise<void> {
    await this.userManager.signoutRedirect();
  }

  public async getUser(): Promise<User | null> {
    return await this.userManager.getUser();
  }

  public async handleRedirectCallback(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      console.log(user);
      return user;
    } catch (error) {
      console.error('Error handling redirect callback', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
