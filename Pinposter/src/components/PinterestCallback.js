import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import pinterestApi from '../services/pinterest';
import { CircularProgress, Typography, Container } from '@material-ui/core';

function PinterestCallback() {
const [error, setError] = useState(null);
const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  const handleCallback = async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setError(error);
      return;
    }

    try {
      // Get access token
      const tokenData = await pinterestApi.getAccessToken(code);

      // Store token in Firestore
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await setDoc(doc(db, 'users', userId, 'pinterest_tokens', 'current'), {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        created_at: new Date().toISOString()
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  handleCallback();
}, [location, navigate]);

if (error) {
  return (
    <Container>
      <Typography color="error">
        Error: {error}
      </Typography>
    </Container>
  );
}

return (
  <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Container>
);
}

export default PinterestCallback;