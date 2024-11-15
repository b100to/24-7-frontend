import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';  // 날짜 포맷팅을 위해 추가
import { ko } from 'date-fns/locale';  // 한국어 로케일
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

// 서울시 구 목록
const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '��평구', '종로구', '중구', '중랑구'
].sort();  // 가나다순 정렬

function AdminMemberList({ members, setMembers }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    birthYear: '',
    gender: '',
    location: '',
    note: ''
  });
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthExpiration');
    navigate('/');
  };

  // 인증 상태가 아니면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!localStorage.getItem('adminAuthenticated')) {
      navigate('/');
    }
  }, [navigate]);

  if (!localStorage.getItem('adminAuthenticated')) {
    return null;
  }

  // 날짜를 보기 좋게 포맷팅
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy년 M월 d일', { locale: ko });
  };

  // 출생연도로 표시할 때 앞 두 자리(19/20) 생략
  const formatBirthYear = (year) => {
    if (!year) return '';
    return year.toString().slice(2);
  };

  // 출생연도를 만 나이로 계산
  const calculateAge = (birthYear) => {
    if (!birthYear) return '';
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  // 새 모임원 추가
  const handleAddMember = async () => {
    try {
      // 새 멤버 데이터 준비
      const memberData = {
        ...newMember,
        joinDate: format(new Date(), 'yyyy-MM-dd'),
        isNewbie: true,
        createdAt: new Date().toISOString()
      };

      // Firestore에 추가
      const docRef = await addDoc(collection(db, 'members'), memberData);

      // ID를 포함한 최종 데이터
      const addedMember = {
        id: docRef.id,
        ...memberData
      };

      console.log('새 모임원 추가됨:', addedMember);

      // 로컬 상태 업데이트
      setMembers(prev => [...prev, addedMember]);

      // 폼 초기화
      setOpenDialog(false);
      setNewMember({
        name: '',
        birthYear: '',
        gender: '',
        location: '',
        note: ''
      });
    } catch (error) {
      console.error('모임원 추가 실패:', error);
      alert('모임원 추가에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭 시
  const handleEdit = (index) => {
    const memberToEdit = members[index];
    setNewMember({
      name: memberToEdit.name,
      birthYear: memberToEdit.birthYear,
      gender: memberToEdit.gender,
      location: memberToEdit.location,
      note: memberToEdit.note || ''
    });
    setEditingIndex(index);
    setOpenDialog(true);
  };

  // 모임원 수정
  const handleEditMember = async () => {
    try {
      const memberToUpdate = members[editingIndex];
      const memberRef = doc(db, 'members', memberToUpdate.id);

      const updatedData = {
        ...memberToUpdate,
        name: newMember.name,
        birthYear: newMember.birthYear,
        gender: newMember.gender,
        location: newMember.location,
        note: newMember.note,
        updatedAt: new Date().toISOString()
      };

      // Firestore 업데이트
      await updateDoc(memberRef, updatedData);

      // 로컬 상태 업데이트
      const updatedMembers = [...members];
      updatedMembers[editingIndex] = updatedData;
      setMembers(updatedMembers);

      console.log('모임원 수정됨:', updatedData);

      // 폼 초기화
      setOpenDialog(false);
      setEditingIndex(null);
      setNewMember({
        name: '',
        birthYear: '',
        gender: '',
        location: '',
        note: ''
      });
    } catch (error) {
      console.error('모임원 수정 실패:', error);
      alert('모임원 수정에 실패했습니다.');
    }
  };

  // 모임원 삭제
  const handleDelete = async (index) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const memberToDelete = members[index];
      await deleteDoc(doc(db, 'members', memberToDelete.id));

      setMembers(prev => prev.filter((_, i) => i !== index));
      console.log('모임원 삭제됨:', memberToDelete);
    } catch (error) {
      console.error('모임원 삭제 실패:', error);
      alert('모임원 삭제에 실패했습니다.');
    }
  };

  // 다이얼로그 저장 버튼 핸들러
  const handleSave = () => {
    if (!newMember.name || !newMember.birthYear || !newMember.gender || !newMember.location) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (editingIndex !== null) {
      handleEditMember();
    } else {
      handleAddMember();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          모임원 관리 ({members.length}명)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingIndex(null);
              setNewMember({
                name: '',
                birthYear: '',
                gender: '',
                location: '',
                note: ''
              });
              setOpenDialog(true);
            }}
          >
            새 모임원
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            size="small"
          >
            로그아웃
          </Button>
        </Box>
      </Box>

      <List>
        {members.map((member, index) => (
          <React.Fragment key={member.id || index}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(index)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar src={member.photoURL}>
                  {member.name?.[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">
                      {member.name}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      {[
                        member.gender,
                        member.location,
                        `가입: ${member.joinDate}`,
                        member.note
                      ].filter(Boolean).join(' • ')}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < members.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* 추가/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={() => {
        setOpenDialog(false);
        setEditingIndex(null);
        setNewMember({
          name: '',
          birthYear: '',
          gender: '',
          location: '',
          note: ''
        });
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingIndex !== null ? '모임원 수정' : '새 모임원 추가'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="출생연도"
                type="number"
                value={newMember.birthYear || ''}
                onChange={(e) => {
                  const year = e.target.value;
                  // 2자리 입력 시 19xx/20xx 자동 변환
                  if (year.length === 2) {
                    const fullYear = parseInt(year) > 23 ? `19${year}` : `20${year}`;
                    setNewMember({ ...newMember, birthYear: fullYear });
                  } else {
                    setNewMember({ ...newMember, birthYear: year });
                  }
                }}
                placeholder="95"
                inputProps={{
                  maxLength: 4
                }}
                helperText="95 입력시 1995년, 01 입력시 2001년"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="성별"
                value={newMember.gender}
                onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
              >
                <MenuItem value="남성">남성</MenuItem>
                <MenuItem value="여성">여성</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="거주구"
                value={newMember.location}
                onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
              >
                <MenuItem value="">선택 안함</MenuItem>
                {SEOUL_DISTRICTS.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="가입날짜"
                type="date"
                value={newMember.joinDate}
                onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="메모"
                value={newMember.note}
                onChange={(e) => setNewMember({ ...newMember, note: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newMember.isNewbie}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        isNewbie: e.target.checked
                      })}
                      color="primary"
                    />
                  }
                  label="신입 모임원"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newMember.isStaff}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        isStaff: e.target.checked
                      })}
                      sx={{
                        '&.Mui-checked': {
                          color: '#e91e63',
                        },
                      }}
                    />
                  }
                  label="운영진"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button onClick={handleSave} variant="contained">
            {editingIndex !== null ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AdminMemberList; 