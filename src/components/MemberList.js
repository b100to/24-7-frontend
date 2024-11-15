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

// 서울시 구 목록
const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구'
].sort();  // 가나다순 정렬

function MemberList({ members, setMembers }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    birthYear: '',
    gender: '',
    location: '',
    note: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    isNewbie: true,
    isStaff: false,
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

  const handleAddMember = () => {
    if (newMember.name.trim()) {
      if (editingIndex !== null) {
        // 수정 모드
        const updatedMembers = [...members];
        updatedMembers[editingIndex] = newMember;
        setMembers(updatedMembers);
        setEditingIndex(null);
      } else {
        // 추가 모드
        setMembers([...members, newMember]);
      }
      setNewMember({
        name: '',
        birthYear: '',
        gender: '',
        location: '',
        note: '',
        joinDate: format(new Date(), 'yyyy-MM-dd'),
        isNewbie: true,
        isStaff: false,
      });
      setOpenDialog(false);
    }
  };

  const handleEditMember = (index) => {
    setEditingIndex(index);
    setNewMember(members[index]);
    setOpenDialog(true);
  };

  const handleDeleteMember = (index) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
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
                note: '',
                joinDate: format(new Date(), 'yyyy-MM-dd'),
                isNewbie: true,
                isStaff: false,
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
          <React.Fragment key={index}>
            <ListItem
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditMember(index)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteMember(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar 
                  src={member?.photoURL || ''} 
                  alt={member?.name || '멤버'}
                >
                  {member?.name?.[0] || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {member.name}
                      {member.birthYear && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            color: 'text.secondary',
                            ml: 1,
                            fontSize: '0.9rem'
                          }}
                        >
                          {formatBirthYear(member.birthYear)}년생
                          {` (${calculateAge(member.birthYear)}세)`}
                        </Typography>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {member.isStaff && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: '#e91e63',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px'
                          }}
                        >
                          STAFF
                        </Typography>
                      )}
                      {member.isNewbie && (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: '#ff5722',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          NEW
                        </Typography>
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      {[
                        member.gender,
                        member.location,
                        `가입: ${formatDate(member.joinDate)}`,
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
          <Button onClick={handleAddMember} variant="contained">
            {editingIndex !== null ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default MemberList; 