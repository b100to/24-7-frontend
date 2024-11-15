import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

function PaymentDetail({ meeting, onBack }) {
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    amount: ''
  });

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/meetings/${meeting.id}/participants`, {
        name: newParticipant.name,
        amount: parseFloat(newParticipant.amount),
        has_paid: false
      });
      setNewParticipant({ name: '', amount: '' });
      // TODO: Refresh meeting data
    } catch (error) {
      alert('참가자 추가에 실패했습니다.');
    }
  };

  const handlePaymentStatus = async (participantId) => {
    try {
      await axios.put(
        `${API_URL}/meetings/${meeting.id}/participants/${participantId}`,
        { has_paid: true }
      );
      // TODO: Refresh meeting data
    } catch (error) {
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Button onClick={onBack} sx={{ mb: 2 }}>
        뒤로 가기
      </Button>
      
      <Typography variant="h5" gutterBottom>
        {meeting.title}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        날짜: {new Date(meeting.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        총액: {meeting.total_amount.toLocaleString()}원
      </Typography>
      <Typography variant="body1" gutterBottom>
        계좌: {meeting.bank_account}
      </Typography>

      <Box component="form" onSubmit={handleAddParticipant} sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          참가자 추가
        </Typography>
        <TextField
          label="이름"
          value={newParticipant.name}
          onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
          sx={{ mr: 2 }}
        />
        <TextField
          label="금액"
          type="number"
          value={newParticipant.amount}
          onChange={(e) => setNewParticipant({...newParticipant, amount: e.target.value})}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" type="submit">
          추가
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        참가자 목록
      </Typography>
      <List>
        {meeting.participants?.map((participant) => (
          <ListItem key={participant.id}>
            <ListItemText
              primary={participant.name}
              secondary={`${participant.amount.toLocaleString()}원`}
            />
            <ListItemSecondaryAction>
              {!participant.has_paid && (
                <IconButton 
                  onClick={() => handlePaymentStatus(participant.id)}
                  color="primary"
                >
                  <CheckCircleIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default PaymentDetail; 