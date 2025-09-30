import React from 'react';
import Button from '@mui/material/Button';
import { authService } from '../utils/oidc';

export const SignInButton: React.FC = () => {
  const handleSignIn = (): void => {
    void authService.signIn().catch((error) => {
      console.error('Sign-in failed:', error);
    });
  };

  return (
    <Button variant="contained" onClick={handleSignIn}>
      OIDC Sign In
    </Button>
  );
};
