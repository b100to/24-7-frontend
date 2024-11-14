import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';
import MemberList from './components/MemberList';

function App() {
  const [meetings, setMeetings] = useState(() => {
    const savedMeetings = localStorage.getItem('meetings');
    return savedMeetings ? JSON.parse(savedMeetings) : [];
  });

  const [value, setValue] = React.useState(0);

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
    <BrowserRouter>
      <CssBaseline />
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{
          maxWidth: '600px',
          px: 2,
          pb: 7  // 하단 네비게이션 공간 확보
        }}
      >
        <Box sx={{ my: 2 }}>
          <Typography 
            variant="h4"
            sx={{ 
              mb: 3,
              fontWeight: 'bold',
              color: '#000000',
              fontSize: { 
                xs: '2rem',
                sm: '2.5rem'
              },
              letterSpacing: '-0.5px'
            }}
          >
            24/7 정산 프로그램
          </Typography>
          
          <Routes>
            <Route path="/" element={
              <>
                <MeetingForm onSave={handleSave} />
                {meetings.length > 0 && (
                  <MeetingList 
                    meetings={meetings} 
                    onDelete={handleDelete}
                  />
                )}
              </>
            } />
            <Route path="/members" element={<MemberList />} />
          </Routes>
        </Box>
      </Container>

      {/* 하단 네비게이션 */}
      <Paper 
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="정산하기" 
            icon={<CalculateIcon />} 
            component={Link}
            to="/"
          />
          <BottomNavigationAction 
            label="모임원 관리" 
            icon={<PeopleIcon />} 
            component={Link}
            to="/members"
          />
        </BottomNavigation>
      </Paper>
    </BrowserRouter>
  );
}

export default App;