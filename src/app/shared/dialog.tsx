import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const AlertDialog = ({ open, handleClose, header, description, onConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
