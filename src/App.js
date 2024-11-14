import React, { useState } from 'react';
import { Container, CssBaseline, Box } from '@mui/material';
import MeetingForm from './components/MeetingForm';
import MeetingList from './components/MeetingList';
import MeetingDetail from './components/MeetingDetail';

function App() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {!selectedMeeting ? (
            <>
              <MeetingForm />
              <MeetingList onSelectMeeting={setSelectedMeeting} />
            </>
          ) : (
            <MeetingDetail 
              meeting={selectedMeeting} 
              onBack={() => setSelectedMeeting(null)} 
            />
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;