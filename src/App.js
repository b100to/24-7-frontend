import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Box, Typography } from '@mui/material';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';

function App() {
  const [meetings, setMeetings] = useState(() => {
    const savedMeetings = localStorage.getItem('meetings');
    return savedMeetings ? JSON.parse(savedMeetings) : [];
  });

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const handleSave = (meetingsData) => {
    const newMeetings = [...meetings, ...meetingsData];
    setMeetings(newMeetings);
    localStorage.setItem('meetings', JSON.stringify(newMeetings));
  };

  const handleDelete = (index) => {
    const newMeetings = meetings.filter((_, i) => i !== index);
    setMeetings(newMeetings);
  };

  return (
    <>
      <CssBaseline />
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{
          maxWidth: '600px',  // 모바일 화면에 맞는 최대 너비
          px: 2  // 좌우 패딩
        }}
      >
        <Box sx={{ 
          my: 2,
          position: 'relative'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 'bold',
              color: '#1976d2'
            }}
          >
            2/47 정산 프로그램
          </Typography>
          <MeetingForm onSave={handleSave} />
          {meetings.length > 0 && (
            <MeetingList 
              meetings={meetings} 
              onDelete={handleDelete}
            />
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;