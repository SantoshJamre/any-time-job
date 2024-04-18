import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastMessage = ({ open, onClose, severity, message }) => {
    console.log("::::::::::")
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;