import { User } from 'oidc-client-ts';
import { authService } from '../utils/oidc';

export async function getAccessToken(): Promise<string | null> {
  const user: User | null = await authService.getUser();
  return user?.access_token || null;
}

export default async function authHeader() {
  const token = await getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'X-A2B-Token': token ? `Bearer ${token}` : '',
  };
}

export async function authMultipartHeader() {
  const token = await getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'X-A2B-Token': token ? `Bearer ${token}` : '',
    'Content-Type': 'multipart/form-data',
  };
}
