import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';
import MemberList from './components/MemberList';
import AdminAuth from './components/AdminAuth';
import MemberStatus from './components/MemberStatus';

function AppContent() {
  const [meetings, setMeetings] = useState(() => {
    const savedMeetings = localStorage.getItem('meetings');
    return savedMeetings ? JSON.parse(savedMeetings) : [];
  });

  const [value, setValue] = React.useState(0);
  const [openAuth, setOpenAuth] = useState(false);
  const navigate = useNavigate();

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
    localStorage.setItem('members', JSON.stringify(members));
  }, [meetings, members]);

  const handleSave = (meetingsData) => {
    const newMeetings = [...meetings, ...meetingsData];
    setMeetings(newMeetings);
    localStorage.setItem('meetings', JSON.stringify(newMeetings));
  };

  const handleDelete = (index) => {
    const newMeetings = meetings.filter((_, i) => i !== index);
    setMeetings(newMeetings);
  };

  // 인증 상태 체크 함수
  const checkAdminAuth = () => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const expirationTime = localStorage.getItem('adminAuthExpiration');
    
    if (isAuthenticated && expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > parseInt(expirationTime)) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthExpiration');
        return false;
      }
      return true;
    }
    return false;
  };

  // 관리자 페이지 접근 처리
  const handleAdminAccess = () => {
    if (checkAdminAuth()) {
      navigate('/admin');  // 이미 인증된 경우 바로 이동
    } else {
      setOpenAuth(true);   // 인증 필요한 경우 다이얼로그 표시
    }
  };

  return (
    <>
      <CssBaseline />
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{
          maxWidth: '600px',
          px: 2,
          pb: 7
        }}
      >
        <Box 
          sx={{ 
            my: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            },
            transition: 'opacity 0.2s'
          }}
          onClick={() => navigate('/')}
        >
          <Typography 
            variant="h4"
            sx={{ 
              mb: 0.5,
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: { 
                xs: '2.2rem',
                sm: '2.7rem'
              },
              letterSpacing: '-0.5px',
              textAlign: 'center'
            }}
          >
            24/7
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              fontWeight: 500,
              letterSpacing: '1px',
              mb: 3,
              fontSize: { 
                xs: '1.1rem',
                sm: '1.3rem'
              },
              textTransform: 'uppercase'
            }}
          >
            Community Hub
          </Typography>
        </Box>

        <Routes>
          <Route path="/" element={
            <MemberStatus 
              members={members} 
              onAdminClick={() => handleAdminAccess()}  // 변경
            />
          } />
          <Route path="/calculate" element={
            <>
              <MeetingForm 
                onSave={handleSave} 
                members={members}
              />
              {meetings.length > 0 && (
                <MeetingList 
                  meetings={meetings} 
                  onDelete={handleDelete}
                />
              )}
            </>
          } />
          <Route path="/admin" element={
            checkAdminAuth() ? (  // 인증 상태 확인
              <MemberList 
                members={members} 
                setMembers={setMembers} 
              />
            ) : (
              <Navigate to="/" replace />  // 인증 안된 경우 메인으로
            )
          } />
        </Routes>
      </Container>

      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 1000
        }} 
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
            label="모임원 현황" 
            icon={<PeopleIcon />} 
            component={Link}
            to="/"
          />
          <BottomNavigationAction 
            label="정산하기" 
            icon={<CalculateIcon />} 
            component={Link}
            to="/calculate"
          />
        </BottomNavigation>
      </Paper>

      {openAuth && (
        <AdminAuth 
          onAuth={(success) => {
            if (success) {
              navigate('/admin');
            }
            setOpenAuth(false);
          }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;