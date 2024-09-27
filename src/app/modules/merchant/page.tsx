'use client';
import React, { useState } from 'react';
import { Box, Grid, Typography, FormLabel, TextField, Button, Snackbar } from '@mui/material';
import AlertDialog from '../../shared/dialog';
import MuiAlert from '@mui/material/Alert';

const Page = () => {
  const [merchantName, setMerchantName] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantAddress, setMerchantAddress] = useState('');
  const [merchantPhone, setMerchantPhone] = useState('');
  const [merchantPin, setMerchantPin] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Validation logic
  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    switch (name) {
      case 'merchantName':
        if (!value) tempErrors.merchantName = 'Merchant name is required';
        else delete tempErrors.merchantName;
        break;

      case 'merchantEmail':
        if (!value || !/\S+@\S+\.\S+/.test(value)) tempErrors.merchantEmail = 'Valid email is required';
        else delete tempErrors.merchantEmail;
        break;

      case 'merchantAddress':
        if (!value) tempErrors.merchantAddress = 'Address is required';
        else delete tempErrors.merchantAddress;
        break;

      case 'merchantPhone':
        if (!value || !/^\d{10}$/.test(value)) tempErrors.merchantPhone = 'Valid 10-digit phone number is required';
        else delete tempErrors.merchantPhone;
        break;

      case 'merchantPin':
        if (!value || !/^\d{6}$/.test(value)) tempErrors.merchantPin = 'Valid 6-digit pin code is required';
        else delete tempErrors.merchantPin;
        break;

      default:
        break;
    }

    setErrors(tempErrors);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      setOpenDialog(true);
    }
  };

  // Handle dialog confirmation
  const handleDialogConfirm = () => {
    // Simulate successful update
    setIsEditable(false); // Disable fields after successful submission
    setSnackbarOpen(true); // Show snackbar notification
    setOpenDialog(false); // Close dialog
  };

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Manage Merchant
      </Typography>

      {/* Edit Details button at the top */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsEditable(true)}
        sx={{ mb: 2 }}
      >
        Edit Details
      </Button>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormLabel>Merchant ID</FormLabel>
            <Typography variant="body1">#########</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Merchant Name"
              placeholder="Enter your Name"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              onBlur={(e) => validateField('merchantName', e.target.value)}
              error={!!errors.merchantName}
              helperText={errors.merchantName}
              InputProps={{ readOnly: !isEditable }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Merchant Email"
              placeholder="Enter your Email"
              value={merchantEmail}
              onChange={(e) => setMerchantEmail(e.target.value)}
              onBlur={(e) => validateField('merchantEmail', e.target.value)}
              error={!!errors.merchantEmail}
              helperText={errors.merchantEmail}
              InputProps={{ readOnly: !isEditable }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Merchant Address"
              placeholder="Enter your Address"
              value={merchantAddress}
              onChange={(e) => setMerchantAddress(e.target.value)}
              onBlur={(e) => validateField('merchantAddress', e.target.value)}
              error={!!errors.merchantAddress}
              helperText={errors.merchantAddress}
              InputProps={{ readOnly: !isEditable }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              placeholder="Enter your Phone Number"
              value={merchantPhone}
              onChange={(e) => setMerchantPhone(e.target.value)}
              onBlur={(e) => validateField('merchantPhone', e.target.value)}
              error={!!errors.merchantPhone}
              helperText={errors.merchantPhone}
              InputProps={{ readOnly: !isEditable }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="PinCode"
              placeholder="Enter your Pincode"
              value={merchantPin}
              onChange={(e) => setMerchantPin(e.target.value)}
              onBlur={(e) => validateField('merchantPin', e.target.value)}
              error={!!errors.merchantPin}
              helperText={errors.merchantPin}
              InputProps={{ readOnly: !isEditable }}
            />
          </Grid>

          {isEditable && (
            <Grid item xs={12}>
              {/* Update Details button at the bottom */}
              <Button variant="contained" color="primary" fullWidth type="submit">
                Update Details
              </Button>
            </Grid>
          )}
        </Grid>
      </form>

      <Box mt={4}>
        <AlertDialog
          open={openDialog}
          handleClose={handleDialogClose}
          header="Merchant Details Confirmation"
          description="Please confirm your merchant details below:"
          merchantName={merchantName}
          merchantEmail={merchantEmail}
          merchantAddress={merchantAddress}
          onConfirm={handleDialogConfirm} // Pass the confirm handler to the dialog
        />
      </Box>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          Details updated successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Page;
