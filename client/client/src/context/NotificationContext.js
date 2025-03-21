import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info' // 'error', 'warning', 'info', 'success'
  });

  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}; 