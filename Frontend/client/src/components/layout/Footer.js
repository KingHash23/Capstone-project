
import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { LinkedIn, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        {/* Social Media Icons */}
        <Box sx={{ mb: 2 }}>
          <IconButton
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <LinkedIn />
          </IconButton>

          <IconButton
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <Twitter />
          </IconButton>

          <IconButton
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            color="secondary"
          >
            <Instagram />
          </IconButton>
        </Box>

        {/* Copyright Text */}
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Job Portal
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
