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
  Typography,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { format } from 'date-fns';

function NewMemberForm({ open, onSubmit, userData }) {
  const [formData, setFormData] = useState({
    name: userData?.displayName || '',
    birthYear: '',
    gender: '',
    location: '',
    mbti: '',
    isNewMember: true,
    joinDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [errors, setErrors] = useState({});

  const locations = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구',
    '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구',
    '중구', '중랑구'
  ].sort();

  const mbtiTypes = [
    'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
    'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
    'INFP', 'INFJ', 'INTP', 'INTJ',
    'ISFP', 'ISFJ', 'ISTP', 'ISTJ'
  ];

  const currentYear = new Date().getFullYear();
  
  // 20-30대 범위 계산 (20세~39세)
  const maxAge = 39;
  const minAge = 20;
  const startYear = currentYear - maxAge;  // 39세의 출생연도
  const endYear = currentYear - minAge;    // 20세의 출생연도
  
  // 출생연도 목록 생성 (현재 기준 20-30대만)
  const birthYears = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => (startYear + i).toString()
  );

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = '이름을 입력해주세요';
    if (!formData.birthYear) newErrors.birthYear = '출생연도를 입력해주세요';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요';
    if (!formData.location) newErrors.location = '지역을 입력해주세요';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle>
        모임원 정보 입력
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          * 표시는 필수 입력 항목입니다
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isNewMember}
                onChange={(e) => setFormData({...formData, isNewMember: e.target.checked})}
                color="primary"
              />
            }
            label={formData.isNewMember ? "신입 모임원" : "기존 모임원"}
          />

          <TextField
            required
            label="이름"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={!!errors.name}
            helperText={errors.name}
          />

          <FormControl required error={!!errors.birthYear}>
            <InputLabel>출생연도</InputLabel>
            <Select
              value={formData.birthYear}
              label="출생연도"
              onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
            >
              {birthYears.map(year => (
                <MenuItem key={year} value={year}>
                  {year}년생 ({currentYear - parseInt(year)}세)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            required
            label="가입일자"
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl required error={!!errors.gender}>
            <InputLabel>성별</InputLabel>
            <Select
              value={formData.gender}
              label="성별"
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <MenuItem value="남성">남성</MenuItem>
              <MenuItem value="여성">여성</MenuItem>
            </Select>
          </FormControl>

          <FormControl required error={!!errors.location}>
            <InputLabel>지역</InputLabel>
            <Select
              value={formData.location}
              label="지역"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            >
              {locations.map(location => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>MBTI</InputLabel>
            <Select
              value={formData.mbti}
              label="MBTI"
              onChange={(e) => setFormData({...formData, mbti: e.target.value})}
            >
              {mbtiTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            필수 입력 항목을 모두 작성해주세요.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          fullWidth
          sx={{ m: 2 }}
        >
          등록하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewMemberForm; 