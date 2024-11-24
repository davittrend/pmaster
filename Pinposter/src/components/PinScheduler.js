import React, { useState, useEffect } from 'react';
import {
Paper,
TextField,
Button,
Grid,
Typography,
Select,
MenuItem,
FormControl,
InputLabel,
} from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext';
import pinterestService from '../services/pinterest';

function PinScheduler() {
const { currentUser } = useAuth();
const [boards, setBoards] = useState([]);
const [formData, setFormData] = useState({
  title: '',
  description: '',
  link: '',
  imageUrl: '',
  boardId: '',
  scheduledTime: new Date(),
});

useEffect(() => {
  const fetchBoards = async () => {
    try {
      const boardsData = await pinterestService.getBoards(currentUser.uid);
      setBoards(boardsData.items);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  fetchBoards();
}, [currentUser]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await pinterestService.schedulePin(currentUser.uid, {
      title: formData.title,
      description: formData.description,
      link: formData.link,
      media_source: {
        source_type: 'image_url',
        url: formData.imageUrl,
      },
      board_id: formData.boardId,
    }, formData.scheduledTime);

    // Reset form
    setFormData({
      title: '',
      description: '',
      link: '',
      imageUrl: '',
      boardId: '',
      scheduledTime: new Date(),
    });
  } catch (error) {
    console.error('Error scheduling pin:', error);
  }
};

return (
  <Paper style={{ padding: 20 }}>
    <Typography variant="h6" gutterBottom>
      Schedule New Pin
    </Typography>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Link URL"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Board</InputLabel>
            <Select
              value={formData.boardId}
              onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
            >
              {boards.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Schedule Pin
          </Button>
        </Grid>
      </Grid>
    </form>
  </Paper>
);
}

export default PinScheduler;