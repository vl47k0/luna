import Routing from './Routing';
import Sidebar from './components/Sidebar';
import Box from '@mui/material/Box';
import React from 'react';

const App: React.FC = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Sidebar />
      <Routing />
    </Box>
  );
};

export default App;
