import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { format } from 'date-fns';

function NewMemberForm({ open, onClose, onSubmit, userData }) {
  const [memberData, setMemberData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    birthYear: '',
    gender: '',
    location: '',
    note: '',
    joinDate: format(new Date(), 'yyyy-MM-dd'),
    isNewbie: true,
    isStaff: false
  });

  // 구 목록
  const districts = [
    '강남구', '강동구', '강북구', '강서구', '관악구', 
    '광진구', '구로구', '금천구', '노원구', '도봉구', 
    '동대문구', '동작구', '마포구', '서대문구', '서초구',
    '성동구', '성북구', '송파구', '양천구', '영등포구',
    '용산구', '은평구', '종로구', '중구', '중랑구'
  ];

  const handleSubmit = () => {
    onSubmit({
      ...memberData,
      id: userData.id,
      photoURL: userData.photoURL
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>모임원 정보 입력</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            처음 방문하셨네요! 모임원 정보를 입력해주세요.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이름"
                value={memberData.name}
                onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                helperText="실명을 입력해주세요"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="출생년도"
                value={memberData.birthYear}
                onChange={(e) => {
                  const year = e.target.value;
                  if (year.length === 2) {
                    const fullYear = parseInt(year) > 23 ? `19${year}` : `20${year}`;
                    setMemberData({ ...memberData, birthYear: fullYear });
                  } else {
                    setMemberData({ ...memberData, birthYear: year });
                  }
                }}
                placeholder="95"
                inputProps={{ maxLength: 4 }}
                helperText="95 입력시 1995년, 01 입력시 2001년"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>성별</InputLabel>
                <Select
                  value={memberData.gender}
                  label="성별"
                  onChange={(e) => setMemberData({ ...memberData, gender: e.target.value })}
                >
                  <MenuItem value="남성">남성</MenuItem>
                  <MenuItem value="여성">여성</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>거주지</InputLabel>
                <Select
                  value={memberData.location}
                  label="거주지"
                  onChange={(e) => setMemberData({ ...memberData, location: e.target.value })}
                >
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="비고"
                value={memberData.note}
                onChange={(e) => setMemberData({ ...memberData, note: e.target.value })}
                multiline
                rows={2}
                placeholder="추가 정보를 입력해주세요 (선택사항)"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!memberData.name || !memberData.birthYear || !memberData.gender || !memberData.location}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewMemberForm; 