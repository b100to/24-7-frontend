import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction, Paper, Avatar, Button, CircularProgress } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';
import MemberList from './components/MemberList';
import AdminAuth from './components/AdminAuth';
import MemberStatus from './components/MemberStatus';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import NewMemberForm from './components/NewMemberForm';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc,
  onSnapshot,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

function AppContent() {
  const [meetings, setMeetings] = useState(() => {
    const savedMeetings = localStorage.getItem('meetings');
    return savedMeetings ? JSON.parse(savedMeetings) : [];
  });

  const [value, setValue] = React.useState(0);
  const [openAuth, setOpenAuth] = useState(false);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
    localStorage.setItem('members', JSON.stringify(members));
  }, [meetings, members]);

  useEffect(() => {
    // Firebase 인증 상태 변경 감지
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 멤버 체크
        const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
        const existingMember = savedMembers.find(m => m.id === userData.id);
        if (!existingMember) {
          setShowNewMemberForm(true);
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Firestore에서 멤버 데이터 실시간 동기화
    const membersRef = collection(db, 'members');
    
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const loadedMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('멤버 데이터 업데이트:', loadedMembers);
      setMembers(loadedMembers);
    }, (error) => {
      console.error('멤버 데이터 로드 실패:', error);
    });

    return () => unsubscribe();
  }, []);

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

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 로그인 처리
  const handleLogin = async (userData) => {
    try {
      setUser(userData);
      
      // 이미 가입한 멤버인지 확인
      const memberRef = doc(db, 'members', userData.id);
      const memberDoc = await getDoc(memberRef);
      
      if (!memberDoc.exists()) {
        console.log('새 사용자 감지됨:', userData.email);
        setShowNewMemberForm(true);
      } else {
        console.log('기존 멤버 로그인:', userData.email);
      }
    } catch (error) {
      console.error('로그인 처리 에러:', error);
    }
  };

  // 새 멤버 등록
  const handleNewMember = async (memberData) => {
    try {
      const memberRef = doc(db, 'members', memberData.id);
      await setDoc(memberRef, {
        ...memberData,
        createdAt: new Date().toISOString()
      });
      
      console.log('새 멤버 등록됨:', memberData);
      setShowNewMemberForm(false);
    } catch (error) {
      console.error('멤버 등록 에러:', error);
      alert('멤버 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // MemberStatus 컴포넌트에 전달
  const memberStats = {
    total: members.length,
    male: members.filter(m => m.gender === '남성').length,
    female: members.filter(m => m.gender === '여성').length,
    // ... 기타 통계
  };

  return (
    <>
      <CssBaseline />
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Container maxWidth={false} disableGutters sx={{ maxWidth: '600px', px: 2, pb: 7 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              py: 2 
            }}>
              <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                <Typography variant="h4">24/7</Typography>
                <Typography variant="subtitle1">Community Hub</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={user?.photoURL || ''} 
                  alt={user?.name || '사용자'} 
                  sx={{ width: 40, height: 40 }}
                >
                  {user?.name?.[0] || '?'}
                </Avatar>
                <Button 
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </Box>
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

          {/* 새 멤버 등록 폼 */}
          {showNewMemberForm && (
            <NewMemberForm
              open={showNewMemberForm}
              onClose={() => setShowNewMemberForm(false)}
              onSubmit={handleNewMember}
              userData={user || {}}
            />
          )}
        </>
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