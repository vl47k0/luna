import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface TokenDataProps {
  title: string | undefined;
  id: string | undefined;
  sub: string | undefined;
  email: string | undefined;
  username: string | undefined;
  preferred_username: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
}

const TokenData: React.FC<TokenDataProps> = (props) => {
  const {
    title,
    id,
    sub,
    email,
    username,
    preferred_username,
    first_name,
    last_name,
  } = props;

  const typographyStyle = {
    maxWidth: '100%',
    wordWrap: 'break-word',
  };

  function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <Typography>{title}</Typography>
      <Typography sx={typographyStyle}>
        {first_name} {last_name}
      </Typography>
      <Typography sx={typographyStyle}>{id}</Typography>

      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {email}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {sub}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {preferred_username}
      </Typography>

      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          {username}
        </Link>
      </div>
    </React.Fragment>
  );
};

export default TokenData;
