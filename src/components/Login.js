import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Container,
  CircularProgress 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login({ onLogin }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        console.log('로그인 성공:', result.user);
        
        // 사용자 정보를 저장
        const userData = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          24/7
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          Community Hub
        </Typography>

        {error && (
          <Typography 
            color="error" 
            sx={{ mb: 2 }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          size="large"
          sx={{ 
            width: '100%',
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {loading ? '로그인 중...' : 'Google로 로그인'}
        </Button>
      </Paper>
    </Container>
  );
}

export default Login; 