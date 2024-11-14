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
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function MemberList() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const handleAddMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  const handleDeleteMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        모임원 관리
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          label="새 모임원 이름"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddMember();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddMember}
          startIcon={<AddIcon />}
        >
          추가
        </Button>
      </Box>

      <List>
        {members.map((member, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteMember(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={member} />
            </ListItem>
            {index < members.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default MemberList; 