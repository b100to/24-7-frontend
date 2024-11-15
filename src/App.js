import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction, Paper, Avatar, Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import PeopleIcon from '@mui/icons-material/People';
import MeetingForm from './components/payment/CalculationForm';
import MeetingList from './components/payment/CalculationHistory';
import MemberList from './components/admin/MemberList';
import AdminAuth from './components/auth/AdminAuth';
import MemberStatus from './components/member/MemberStatus';
import Login from './components/auth/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import NewMemberForm from './components/member/NewMemberForm';
import {
  collection,
  setDoc,
  doc,
  onSnapshot,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

function AppContent() {
  const [meetings, setMeetings] = useState([]);

  const [value, setValue] = React.useState(0);
  const [openAuth, setOpenAuth] = useState(false);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);

  const [user, setUser] = useState(null);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
    localStorage.setItem('members', JSON.stringify(members));
  }, [meetings, members]);

  // Firebase 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setUser(userData);

        try {
          // Firestore에서 멤버 확인
          const membersRef = collection(db, 'members');
          const q = query(membersRef, where("email", "==", userData.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log('새 사용자 감지됨:', userData.email);
            setShowNewMemberForm(true);
          } else {
            console.log('기존 멤버 로그인:', userData.email);
            setShowNewMemberForm(false);
          }
        } catch (error) {
          console.error('멤버 확인 실패:', error);
        }
      } else {
        setUser(null);
        setShowNewMemberForm(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore에서 멤버 데이터 실시간 동기화
  useEffect(() => {
    if (!user) return;

    console.log('현재 로그인한 사용자:', user);  // 디버깅용

    const membersRef = collection(db, 'members');
    const q = query(membersRef, where("uid", "==", user.uid));  // uid로 정확히 검색

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const isExistingMember = !snapshot.empty;
      console.log('기존 회원 여부:', isExistingMember);  // 디버깅용
      setShowNewMemberForm(!isExistingMember);
    });

    return () => unsubscribe();
  }, [user]);

  // Firestore에서 미팅 데이터 실시간 동기화
  useEffect(() => {
    if (!user) return;

    const meetingsRef = collection(db, 'meetings');
    const unsubscribe = onSnapshot(meetingsRef, (snapshot) => {
      const loadedMeetings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('미팅 데이터 업데이트:', loadedMeetings);
      setMeetings(loadedMeetings);
    });

    return () => unsubscribe();
  }, [user]);

  // 미팅 저장 핸들러
  const handleSave = async (meetingData) => {
    try {
      const meetingsRef = collection(db, 'meetings');
      const docRef = await addDoc(meetingsRef, meetingData);

      console.log('정산 데이터 저장됨:', { id: docRef.id, ...meetingData });
    } catch (error) {
      console.error('정산 저장 실패:', error);
      alert('정산 저장에 실패했습니다.');
    }
  };

  // 미팅 삭제 핸들러
  const handleDelete = async (meetingId) => {
    try {
      const meetingRef = doc(db, 'meetings', meetingId);
      await deleteDoc(meetingRef);
      console.log('미팅 삭제됨:', meetingId);
    } catch (error) {
      console.error('미팅 삭제 실패:', error);
      alert('미팅 삭제에 실패했습니다.');
    }
  };

  // 관리자 권한 체크
  const checkAdminAuth = async () => {
    if (!user) return false;

    try {
      const adminRef = doc(db, 'admins', user.id);
      const adminDoc = await getDoc(adminRef);
      return adminDoc.exists();
    } catch (error) {
      console.error('관리자 권한 확인 실패:', error);
      return false;
    }
  };

  // 관리자 페이지 접근 처리
  const handleAdminAccess = () => {
    if (checkAdminAuth()) {
      navigate('/admin');  // 이미 인증된 경우 바로 이동
    } else {
      setOpenAuth(true);   // 인증 필요한 경우 다이로그 표시
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

  // Firestore에서 멤버 데이터 가져오기
  useEffect(() => {
    const membersRef = collection(db, 'members');
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const loadedMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('로드된 멤버:', loadedMembers); // 디버깅용
      setMembers(loadedMembers);
    });

    return () => unsubscribe();
  }, []);

  // 새 멤버 등록
  const handleNewMember = async (memberData) => {
    try {
      const membersRef = collection(db, 'members');
      await addDoc(membersRef, {
        ...memberData,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      });

      console.log('새 멤버 등록 완료');
      setShowNewMemberForm(false);
    } catch (error) {
      console.error('모임원 등록 실패:', error);
      alert('모임원 등록에 실패했습니다.');
    }
  };

  // 관리자 클릭 핸들러 추가
  const handleAdminClick = () => {
    setShowAdminAuth(true);
  };

  // 관리자 인증 완료 핸들러 추가
  const handleAdminAuth = (success) => {
    setShowAdminAuth(false);
    if (success) {
      navigate('/admin/members');
    }
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
                <>
                  <MemberStatus members={members} onAdminClick={handleAdminClick} />
                  {/* ... 다른 컴포넌트들 ... */}
                </>
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
          {showAdminAuth && (
            <AdminAuth
              onAuth={handleAdminAuth}
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