import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MeetingList({ meetings, onDelete }) {
  if (!meetings || meetings.length === 0) {
    return null;
  }

  // 참가자별 총 금액 계산
  const calculateTotalPerPerson = (meetings) => {
    const totals = {};
    meetings.forEach(meeting => {
      meeting.participants.forEach(participant => {
        totals[participant] = (totals[participant] || 0) + meeting.perPerson;
      });
    });
    
    // 같은 금액을 낸 사람들끼리 그룹화
    const groupedTotals = {};
    Object.entries(totals).forEach(([person, amount]) => {
      if (!groupedTotals[amount]) {
        groupedTotals[amount] = [];
      }
      groupedTotals[amount].push(person);
    });
    
    return groupedTotals;
  };

  return (
    <Paper sx={{ p: 3 }}>
      {meetings.map((meeting, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              [{meeting.round} 정산 내역{meeting.location ? ` - ${meeting.location}` : ''}]
            </Typography>
            <IconButton 
              onClick={() => onDelete(index)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 1 }}>
            •총 금액
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, pl: 2 }}>
            {meeting.totalAmount.toLocaleString()}원
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            •참석자
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, pl: 2 }}>
            {meeting.participants.join(' / ')} ({meeting.participants.length}명)
          </Typography>

          {index < meetings.length - 1 && (
            <Typography sx={{ my: 3, textAlign: 'center', color: 'text.secondary' }}>
              ***
            </Typography>
          )}
        </Box>
      ))}

      <Divider sx={{ my: 3 }}>
        <Typography sx={{ color: 'text.secondary' }}>-----</Typography>
      </Divider>

      <Typography variant="body1" sx={{ mb: 2 }}>
        •인당 정산금액
      </Typography>
      {Object.entries(calculateTotalPerPerson(meetings)).map(([amount, people], index) => (
        <Typography key={index} variant="body1" sx={{ mb: 1, pl: 2 }}>
          {people.join(' / ')} 》 {Number(amount).toLocaleString()}원
        </Typography>
      ))}
    </Paper>
  );
}

export default MeetingList;