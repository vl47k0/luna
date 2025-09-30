import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../utils/oidc';
import Typography from '@mui/material/Typography';

const AuthenticateCallback: React.FC = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();

  useEffect((): void => {
    const params: Record<string, string> = {};
    const entries = searchParams.entries();
    let entry = entries.next();
    while (!entry.done) {
      const [key, value] = entry.value;
      params[key] = value;
      entry = entries.next();
    }
    setQueryParams(params);

    const handleAuthCallback = async (): Promise<void> => {
      const user = await authService.handleRedirectCallback();
      console.log(user);
      navigate('/home');
    };

    void handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div>
      <Typography variant="h5">Query Parameters:</Typography>
      <ul>
        {Object.entries(queryParams).map(([key, value]) => (
          <li key={key}>
            <Typography>
              <strong>{key}:</strong> {value}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthenticateCallback;
