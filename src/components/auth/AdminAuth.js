import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

function AdminAuth({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  
  const ADMIN_PASSWORD = '2545';

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      const expirationTime = new Date().getTime() + (30 * 60 * 1000);
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminAuthExpiration', expirationTime.toString());
      onAuth(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleCancel = () => {
    navigate('/');
    onAuth(false);
  };

  return (
    <Dialog 
      open={true} 
      maxWidth="xs" 
      fullWidth
      onClose={handleCancel}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon color="primary" />
          <Typography>관리자 인증</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="관리자 비밀번호"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            error={error}
            helperText={error ? "비밀번호가 일치하지 않습니다" : ""}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          취소
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminAuth; 