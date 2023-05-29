import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

export function ErrorComponent({errorMessage} : { errorMessage: string }) {
  function refreshPage() {
    window.location.reload();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h1" color='Highlight'>
              500
            </Typography>
            <Typography variant="h6" color='Highlight' my={2}>
              Inexpected Error
            </Typography>
            {errorMessage && <Typography variant="body1" color='GrayText'> Error: {errorMessage} </Typography>}
            
            <Button color='warning' variant="contained" sx={{ mt: 5}} onClick={refreshPage}>Back Home</Button>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://img.freepik.com/free-vector/500-internal-server-error-concept-illustration_114360-1885.jpg?w=2000"
              alt=""
              width={500} 
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}