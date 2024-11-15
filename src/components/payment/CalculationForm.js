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
  Tooltip,
  Autocomplete,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { format } from 'date-fns';

function CalculationForm({ onSave, members }) {
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

  // 계좌번호 상태 추가
  const [bankAccount, setBankAccount] = useState({
    bank: '',
    accountNumber: '',
    accountHolder: ''
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
    if (typeof value === 'object' && value !== null) {
      // value가 객체인 경우 (멤버 객체가 선택된 경우)
      newRounds[roundIndex].participants[participantIndex].name = value.name;
    } else {
      // value가 문자열인 경우 (직접 입력된 경우)
      newRounds[roundIndex].participants[participantIndex].name = value;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 차수의 참가자를 하나의 Set으로 합치기
    const allParticipants = new Set();
    let totalAmount = 0;
    const roundDetails = [];

    rounds.forEach((round, index) => {
      const participants = round.participants.map(p => p.name).filter(Boolean);
      participants.forEach(p => allParticipants.add(p));
      totalAmount += Number(round.totalAmount);

      roundDetails.push({
        round: index + 1,
        location: round.location,
        amount: Number(round.totalAmount),
        participants: participants,
        perPerson: Math.round(round.totalAmount / participants.length)
      });
    });

    // 하나의 정산 데이터로 구성
    const meetingData = {
      date: format(new Date(), 'yyyy-MM-dd'),
      totalAmount: totalAmount,
      totalParticipants: Array.from(allParticipants),
      averagePerPerson: Math.round(totalAmount / allParticipants.size),
      rounds: roundDetails,
      bankAccount: {
        bank: bankAccount.bank,
        accountNumber: bankAccount.accountNumber,
        accountHolder: bankAccount.accountHolder
      },
      createdAt: new Date().toISOString()
    };

    onSave(meetingData);
    setRounds([{ location: '', totalAmount: '', participants: [{ name: '' }] }]);
    setBankAccount({ bank: '', accountNumber: '', accountHolder: '' }); // 계좌번호 초기화
  };

  // 폼 초기화 함수
  const handleReset = () => {
    setRounds([{
      round: 1,
      participants: [{ name: '' }],
      totalAmount: '',
      location: ''
    }]);
    localStorage.setItem('formRounds', JSON.stringify([{
      round: 1,
      participants: [{ name: '' }],
      totalAmount: '',
      location: ''
    }]));
  };

  // 참가자 입력 필드를 Autocomplete로 변경
  const renderParticipantField = (roundIndex, participantIndex, participant) => (
    <Box key={participantIndex} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Autocomplete
        freeSolo
        options={members}
        getOptionLabel={(option) => {
          // option이 문자열이거나 null인 경우 처리
          if (typeof option === 'string' || !option) return option || '';
          // option이 객체인 경우
          return option.name || '';
        }}
        value={participant.name}
        onChange={(event, newValue) => {
          handleParticipantChange(roundIndex, participantIndex, newValue);
        }}
        onInputChange={(event, newInputValue) => {
          handleParticipantChange(roundIndex, participantIndex, newInputValue);
        }}
        sx={{ flex: 1, mr: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`참가자 ${participantIndex + 1}`}
            required
          />
        )}
      />
      {participantIndex === rounds[roundIndex].participants.length - 1 ? (
        <IconButton onClick={() => handleAddParticipant(roundIndex)} color="primary">
          <AddIcon />
        </IconButton>
      ) : (
        <IconButton 
          onClick={() => handleRemoveParticipant(roundIndex, participantIndex)} 
          color="error"
        >
          <RemoveIcon />
        </IconButton>
      )}
    </Box>
  );

  // 금액 빠른 입력 처리 함수
  const handleQuickAmount = (roundIndex, amount) => {
    const currentAmount = Number(rounds[roundIndex].totalAmount) || 0;
    const newAmount = currentAmount + amount;
    handleTotalAmountChange(roundIndex, newAmount.toString());
  };

  // 금액 입력 필드와 빠른 입력 버튼 렌더링
  const renderAmountField = (roundIndex, round) => (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label={`${roundIndex + 1}차 총 금액`}
        type="number"
        value={round.totalAmount}
        onChange={(e) => handleTotalAmountChange(roundIndex, e.target.value)}
        sx={{ mb: 1 }}
        required
      />
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        flexWrap: 'wrap',
        mt: 1 
      }}>
        <Chip 
          label="+ 10만원" 
          onClick={() => handleQuickAmount(roundIndex, 100000)}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <Chip 
          label="+ 1만원" 
          onClick={() => handleQuickAmount(roundIndex, 10000)}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <Chip 
          label="+ 1천원" 
          onClick={() => handleQuickAmount(roundIndex, 1000)}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <Chip 
          label="+ 100원" 
          onClick={() => handleQuickAmount(roundIndex, 100)}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <Chip 
          label="초기화" 
          onClick={() => handleTotalAmountChange(roundIndex, '')}
          color="error"
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Box>
  );

  // 한국 주요 은행 목록
  const bankOptions = [
    '카카오뱅크',
    '토스뱅크',
    'KB국민',
    '신한',
    '우리',
    'NH농협',
    'IBK기업',
    'KEB하나',
    'SC제일',
    '씨티',
    '새마을',
    '우체국',
    '수협',
    '신협',
  ].sort();  // 가나다순 정렬

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        {/* 계좌번호 입력 섹션 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            정산 계좌
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 첫 번째 줄: 은행 선택과 예금주 */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center'
            }}>
              <FormControl sx={{ width: '150px' }}>
                <InputLabel>은행 선택</InputLabel>
                <Select
                  value={bankAccount.bank}
                  label="은행 선택"
                  onChange={(e) => setBankAccount({...bankAccount, bank: e.target.value})}
                >
                  {bankOptions.map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="예금주"
                value={bankAccount.accountHolder}
                onChange={(e) => setBankAccount({...bankAccount, accountHolder: e.target.value})}
                sx={{ width: '120px' }}
              />
            </Box>
            
            {/* 두 번째 줄: 계좌번호 */}
            <TextField
              label="계좌번호"
              value={bankAccount.accountNumber}
              onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
              fullWidth
              placeholder="- 없이 입력"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {rounds.map((round, roundIndex) => (
          <Box key={roundIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {roundIndex + 1}차
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

            {round.participants.map((participant, participantIndex) => 
              renderParticipantField(roundIndex, participantIndex, participant)
            )}
            
            {renderAmountField(roundIndex, round)}

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

export default CalculationForm;