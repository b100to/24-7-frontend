import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

function MeetingForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    totalAmount: '',
    bankAccount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/meetings`, {
        ...formData,
        total_amount: parseFloat(formData.totalAmount)
      });
      setFormData({
        title: '',
        date: '',
        totalAmount: '',
        bankAccount: ''
      });
      alert('모임이 생성되었습니다!');
    } catch (error) {
      alert('모임 생성에 실패했습니다.');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        새 모임 만들기
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="모임명"
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <TextField
          fullWidth
          type="datetime-local"
          label="날짜"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
        <TextField
          fullWidth
          label="총 금액"
          type="number"
          margin="normal"
          value={formData.totalAmount}
          onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
        />
        <TextField
          fullWidth
          label="입금 계좌"
          margin="normal"
          value={formData.bankAccount}
          onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
        />
        <Button 
          variant="contained" 
          type="submit" 
          sx={{ mt: 2 }}
        >
          모임 만들기
        </Button>
      </Box>
    </Paper>
  );
}

export default MeetingForm;