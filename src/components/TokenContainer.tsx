import React from 'react';
import Typography from '@mui/material/Typography';

interface TokenContainerProps {
  title: string;
  text: string;
}

const TokenContainer: React.FC<TokenContainerProps> = (props) => {
  const { title, text } = props;

  const typographyStyle = {
    maxWidth: '100%',
    wordWrap: 'break-word',
  };

  return (
    <React.Fragment>
      <Typography>{title}</Typography>
      <Typography sx={typographyStyle}>{text}</Typography>
    </React.Fragment>
  );
};

export default TokenContainer;
