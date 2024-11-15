import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

function CalculationHistory({ meetings, onDelete }) {
  if (!meetings || meetings.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {meetings.map((meeting, index) => (
        <Box key={meeting.id || index} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {format(new Date(meeting.date), 'yyyy년 MM월 dd일')} 정산
            </Typography>
            <IconButton 
              onClick={() => onDelete(meeting.id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            총 금액: {meeting.totalAmount?.toLocaleString()}원
          </Typography>
          <Typography variant="body2" color="text.secondary">
            전체 참가자: {meeting.totalParticipants?.join(' / ')} ({meeting.totalParticipants?.length || 0}명)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1인당 평균: {meeting.averagePerPerson?.toLocaleString()}원
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            정산계좌: {meeting.bankAccount?.bank} {meeting.bankAccount?.accountNumber} ({meeting.bankAccount?.accountHolder})
          </Typography>

          <Divider sx={{ my: 2 }} />

          {meeting.rounds?.map((round, roundIndex) => (
            <Box key={roundIndex} sx={{ mb: 2, pl: 2 }}>
              <Typography variant="body2">
                {round.round}차 {round.location && `- ${round.location}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 금액: {round.amount?.toLocaleString()}원
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 참가자: {round.participants?.join(' / ')}
              </Typography>
            </Box>
          ))}

          {index < meetings.length - 1 && (
            <Divider sx={{ my: 3 }} />
          )}
        </Box>
      ))}
    </Paper>
  );
}

export default CalculationHistory;