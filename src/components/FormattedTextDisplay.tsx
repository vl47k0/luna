import React from 'react';
import { Typography } from '@mui/material';
import DOMPurify from 'dompurify';

interface FormattedTextDisplayProps {
  htmlContent: string;
}

const FormattedTextDisplay: React.FC<FormattedTextDisplayProps> = ({
  htmlContent,
}) => {
  const sanitizedHtml: string = DOMPurify.sanitize(htmlContent);
  return (
    <Typography
      variant="body2"
      component="div"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      sx={{
        justifyContent: 'left',
      }}
    />
  );
};

export default FormattedTextDisplay;
