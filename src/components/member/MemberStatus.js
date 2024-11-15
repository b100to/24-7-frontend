import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Collapse,
  Button
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

function MemberStatus({ members, onAdminClick }) {
  // 통계 계산
  const totalMembers = members.length;
  const staffCount = members.filter(member => member.isStaff).length;
  const newbieCount = members.filter(member => member.isNewbie).length;
  const regularCount = totalMembers - staffCount - newbieCount;

  // 성별 통계
  const genderStats = members.reduce((acc, member) => {
    if (member.gender === '남성') acc.male++;
    else if (member.gender === '여성') acc.female++;
    return acc;
  }, { male: 0, female: 0 });

  // 거주구 통계
  const locationStats = members.reduce((acc, member) => {
    if (member.location) {
      acc[member.location] = (acc[member.location] || 0) + 1;
    }
    return acc;
  }, {});

  // 숨겨진 관리자 버튼을 위한 클릭 카운터
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // 제목 클릭 핸들러
  const handleTitleClick = () => {
    const currentTime = new Date().getTime();
    
    // 3초 이내의 클릭만 카운트
    if (currentTime - lastClickTime > 3000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(currentTime);

    // 4번 클릭하면 관리자 인증 다이얼로그 표시
    if (clickCount === 3) {  // 다음 클릭이 4번째
      onAdminClick();
      setClickCount(0);
    }
  };

  // 차트 데이터
  const genderChartData = {
    labels: ['남성', '여성'],
    datasets: [
      {
        data: [genderStats.male, genderStats.female],
        backgroundColor: [
          'rgba(65, 105, 225, 0.8)',  // 로얄 블루
          'rgba(219, 112, 147, 0.8)',  // 팔레 바이올렛 레드
        ],
        borderColor: [
          'rgba(65, 105, 225, 1)',
          'rgba(219, 112, 147, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(65, 105, 225, 0.9)',
          'rgba(219, 112, 147, 0.9)',
        ],
        hoverBorderColor: [
          'rgba(65, 105, 225, 1)',
          'rgba(219, 112, 147, 1)',
        ],
        hoverBorderWidth: 3,
        offset: 4,  // 조각 사이 간격
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,  // 동그란 포인트 스타일 사용
          padding: 15,
          font: {
            size: 14,
            family: "'Noto Sans KR', sans-serif",
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            const total = datasets.data.reduce((a, b) => a + b, 0);
            return chart.data.labels.map((label, i) => ({
              text: `${label} ${datasets.data[i]}명 (${Math.round((datasets.data[i]/total)*100)}%)`,
              fillStyle: datasets.backgroundColor[i],
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        bodyFont: {
          size: 14,
          family: "'Noto Sans KR', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return ` ${value}명 (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',  // 도넛 홀 크기 조정
    rotation: -90,  // 시작 각도 조정
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  const [showMembers, setShowMembers] = useState(false);

  // 모임원 분류
  const staffMembers = members.filter(m => m.isStaff);
  const regularMembers = members.filter(m => !m.isStaff && !m.isNewbie);
  const newbieMembers = members.filter(m => m.isNewbie);

  // 멤버 목록 컴포넌트
  const MemberList = ({ title, members, chipColor }) => (
    <>
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
        {title} ({members.length}명)
      </Typography>
      <List dense>
        {members.map((member, index) => (
          <ListItem
            key={index}
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: chipColor }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={member.name}
              secondary={
                <Box component="span" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {member.gender && (
                    <Chip 
                      label={member.gender} 
                      size="small" 
                      sx={{ height: 20 }}
                    />
                  )}
                  {member.location && (
                    <Chip 
                      label={member.location} 
                      size="small" 
                      sx={{ height: 20 }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* 제목을 클릭 가능하게 만듦 */}
      <Typography 
        variant="h6" 
        gutterBottom 
        onClick={handleTitleClick}
        sx={{ 
          cursor: 'default',  // 마우스 커서 변경 없음
          userSelect: 'none', // 텍스트 선택 방지
          mb: 3
        }}
      >
        모임원 현황
      </Typography>

      {/* 주요 통계 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 2
          }}>
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{totalMembers}</Typography>
            <Typography variant="body2">전체 모임원</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            bgcolor: '#e91e63',
            color: 'white',
            borderRadius: 2
          }}>
            <SupervisorAccountIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{staffCount}</Typography>
            <Typography variant="body2">운영진</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            bgcolor: '#ff5722',
            color: 'white',
            borderRadius: 2
          }}>
            <EmojiPeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{newbieCount}</Typography>
            <Typography variant="body2">신입</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            bgcolor: 'grey.500',
            color: 'white',
            borderRadius: 2
          }}>
            <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{regularCount}</Typography>
            <Typography variant="body2">일반</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* 성별 통계 */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, mb: 2 }}>
        성별 현황
      </Typography>
      <Box sx={{ 
        height: 280,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        mb: 3
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: 500,
          position: 'relative'
        }}>
          <Doughnut data={genderChartData} options={chartOptions} />
          {/* 중앙 텍스트 */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {totalMembers}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              총 인원
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 거주구 통계 */}
      <Typography variant="subtitle1" gutterBottom>
        거주구 현황
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(locationStats)
          .sort(([, a], [, b]) => b - a)
          .map(([location, count]) => (
            <Chip 
              key={location}
              label={`${location} ${count}명`}
              variant="outlined"
              size="small"
            />
          ))}
      </Box>

      {/* 모임원 목록 섹션 */}
      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          onClick={() => setShowMembers(!showMembers)}
          endIcon={showMembers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 1 }}
        >
          모임원 목록 {showMembers ? '접기' : '보기'}
        </Button>
        
        <Collapse in={showMembers}>
          <Box sx={{ mt: 2 }}>
            {staffMembers.length > 0 && (
              <>
                <MemberList 
                  title="운영진" 
                  members={staffMembers} 
                  chipColor="primary.main" 
                />
                <Divider sx={{ my: 2 }} />
              </>
            )}
            
            {regularMembers.length > 0 && (
              <>
                <MemberList 
                  title="정회원" 
                  members={regularMembers} 
                  chipColor="success.main" 
                />
                <Divider sx={{ my: 2 }} />
              </>
            )}
            
            {newbieMembers.length > 0 && (
              <MemberList 
                title="신입회원" 
                members={newbieMembers} 
                chipColor="warning.main" 
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}

export default MemberStatus; 