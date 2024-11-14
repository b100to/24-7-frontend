import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography 
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

function MeetingList({ onSelectMeeting }) {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${API_URL}/meetings`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        모임 목록
      </Typography>
      <List>
        {meetings.map((meeting) => (
          <ListItem 
            key={meeting.id} 
            button 
            onClick={() => onSelectMeeting(meeting)}
          >
            <ListItemText 
              primary={meeting.title}
              secondary={`날짜: ${new Date(meeting.date).toLocaleDateString()} | 총액: ${meeting.total_amount.toLocaleString()}원`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default MeetingList; 