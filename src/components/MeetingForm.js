import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  IconButton,
  Divider,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function MeetingForm({ onSave }) {
  // localStorage에서 폼 데이터 불러오기
  const [rounds, setRounds] = useState(() => {
    const savedRounds = localStorage.getItem('formRounds');
    return savedRounds ? JSON.parse(savedRounds) : [{
      round: 1,
      participants: [{ name: '' }],
      totalAmount: '',
      location: ''
    }];
  });

  // rounds가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('formRounds', JSON.stringify(rounds));
  }, [rounds]);

  // 차수 추가
  const handleAddRound = () => {
    const newRound = {
      round: rounds.length + 1,
      participants: [{ name: '' }],
      totalAmount: '',
      location: ''
    };
    setRounds([...rounds, newRound]);
  };

  // 차수 삭제
  const handleRemoveRound = (roundIndex) => {
    if (rounds.length > 1) {
      const newRounds = rounds.filter((_, index) => index !== roundIndex);
      // 차수 번호 재정렬
      const updatedRounds = newRounds.map((round, index) => ({
        ...round,
        round: index + 1
      }));
      setRounds(updatedRounds);
    }
  };

  // 장소 변경 핸들러 추가
  const handleLocationChange = (roundIndex, value) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].location = value;
    setRounds(newRounds);
  };

  // 참가자 추가
  const handleAddParticipant = (roundIndex) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].participants.push({ name: '' });
    setRounds(newRounds);
  };

  // 참가자 삭제
  const handleRemoveParticipant = (roundIndex, participantIndex) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].participants = newRounds[roundIndex].participants.filter((_, index) => index !== participantIndex);
    setRounds(newRounds);
  };

  // 참가자 이름 변경
  const handleParticipantChange = (roundIndex, participantIndex, value) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].participants[participantIndex].name = value;
    setRounds(newRounds);
  };

  // 총 금액 변경
  const handleTotalAmountChange = (roundIndex, value) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].totalAmount = value;
    setRounds(newRounds);
  };

  // 이전 차수 참가자 복사 함수
  const handleCopyParticipants = (roundIndex) => {
    if (roundIndex === 0) return; // 1차는 복사할 이전 참가자가 없음
    
    const newRounds = [...rounds];
    newRounds[roundIndex].participants = [...rounds[roundIndex - 1].participants];
    setRounds(newRounds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    for (const round of rounds) {
      if (round.participants.some(p => !p.name.trim())) {
        alert(`${round.round}차 참가자 이름을 모두 입력해주세요.`);
        return;
      }
      if (!round.totalAmount) {
        alert(`${round.round}차 총 금액을 입력해주세요.`);
        return;
      }
    }

    // 정산 데이터 생성
    const meetingsData = rounds.map(round => ({
      round: `${round.round}차`,
      location: round.location,
      participants: round.participants.map(p => p.name),
      totalAmount: Number(round.totalAmount),
      perPerson: Math.round(Number(round.totalAmount) / round.participants.length),
      date: new Date().toLocaleDateString()
    }));

    // 모든 차수 정산 데이터를 한 번에 저장
    onSave(meetingsData);
    
    // 성공 메시지 표시
    alert('정산이 완료되었습니다!');
    
    // localStorage에서 폼 데이터 유지
    localStorage.setItem('formRounds', JSON.stringify(rounds));
  };

  // 폼 초기화 함수
  const handleReset = () => {
    if (window.confirm('입력한 내용이 모두 초기화됩니다. 계속하시겠습니까?')) {
      const initialRound = {
        round: 1,
        participants: [{ name: '' }],
        totalAmount: '',
        location: ''
      };
      setRounds([initialRound]);
      localStorage.setItem('formRounds', JSON.stringify([initialRound]));
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        {rounds.map((round, roundIndex) => (
          <Box key={roundIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {round.round}차
              </Typography>
              {roundIndex > 0 && (  // 2차부터 복사 버튼 표시
                <Tooltip title="이전 차수 참가자 복사">
                  <IconButton 
                    onClick={() => handleCopyParticipants(roundIndex)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
              {roundIndex === rounds.length - 1 ? (
                <IconButton onClick={handleAddRound} color="primary">
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton 
                  onClick={() => handleRemoveRound(roundIndex)} 
                  color="error"
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>

            <TextField
              fullWidth
              label="장소 (선택사항)"
              value={round.location || ''}
              onChange={(e) => handleLocationChange(roundIndex, e.target.value)}
              sx={{ mb: 2 }}
            />

            {round.participants.map((participant, participantIndex) => (
              <Box key={participantIndex} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label={`참가자 ${participantIndex + 1}`}
                  value={participant.name}
                  onChange={(e) => handleParticipantChange(roundIndex, participantIndex, e.target.value)}
                  sx={{ mr: 1, flex: 1 }}
                  required
                />
                {participantIndex === round.participants.length - 1 ? (
                  <IconButton onClick={() => handleAddParticipant(roundIndex)} color="primary">
                    <AddIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleRemoveParticipant(roundIndex, participantIndex)} color="error">
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            
            <TextField
              fullWidth
              label={`${round.round}차 총 금액`}
              type="number"
              value={round.totalAmount}
              onChange={(e) => handleTotalAmountChange(roundIndex, e.target.value)}
              sx={{ mt: 1, mb: 2 }}
              required
            />

            {roundIndex < rounds.length - 1 && <Divider sx={{ my: 3 }} />}
          </Box>
        ))}
        
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ mt: 2 }}
          justifyContent="center"
        >
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
            sx={{
              backgroundColor: '#63b3ed',  // 파스텔 파란색
              '&:hover': {
                backgroundColor: '#4299e1',  // 호버 시 약간 진한 파란색
              },
              boxShadow: 'none',  // 그림자 제거
              borderRadius: '8px',  // 모서리 더 둥글게
            }}
          >
            전체 정산하기
          </Button>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{ 
              minWidth: '48px',
              width: '48px',
              height: '48px',
              padding: 0,
              backgroundColor: '#fc8181',  // 파스텔 빨간색
              '&:hover': {
                backgroundColor: '#f56565',  // 호버 시 약간 진한 빨간색
              },
              boxShadow: 'none',  // 그림자 제거
              borderRadius: '8px',  // 모서리 더 둥글게
              '& .MuiButton-startIcon': {
                margin: 0,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#ffffff'
              }
            }}
            startIcon={<RefreshIcon />}
          />
        </Stack>
      </Box>
    </Paper>
  );
}

export default MeetingForm;