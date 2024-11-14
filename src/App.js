import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Box } from '@mui/material';
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
    // 여러 차수의 데이터를 한 번에 저장
    setMeetings(meetingsData);
  };

  const handleDelete = (index) => {
    const newMeetings = meetings.filter((_, i) => i !== index);
    setMeetings(newMeetings);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
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