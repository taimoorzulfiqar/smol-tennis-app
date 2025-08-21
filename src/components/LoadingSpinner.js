import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingSpinner = ({ 
  size = 60, 
  message = 'Loading...', 
  showMessage = true,
  fullHeight = false,
  color = 'primary.main'
}) => {
  return (
    <Fade in={true} timeout={300}>
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight={fullHeight ? "100vh" : "400px"}
        sx={{ 
          background: 'background.default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300'
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ 
            color: color,
            mb: showMessage ? 2 : 0
          }} 
        />
        {showMessage && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default React.memo(LoadingSpinner);
