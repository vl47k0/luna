import ForkRightIcon from '@mui/icons-material/ForkRight';
import React from 'react';

const FlippedIconExample: React.FC = (): JSX.Element => {
  const iconStyle = {
    flipHorizontal: {
      transform: 'scaleX(-1)',
    },
    flipVertical: {
      transform: 'scaleY(-1)',
    },
    flipBoth: {
      transform: 'scale(-1, -1)',
    },
  };

  return (
    <div>
      <div style={iconStyle.flipVertical}>
        <ForkRightIcon />
      </div>
    </div>
  );
};

export default FlippedIconExample;
