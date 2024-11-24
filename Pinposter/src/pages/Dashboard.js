import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Schedule, CloudUpload, AccountCircle, ExitToApp } from '@material-ui/icons';
import PinScheduler from '../components/PinScheduler';

function Dashboard() {
return (
  <div>
    <Drawer variant="permanent">
      <List>
        <ListItem button>
          <ListItemIcon><Schedule /></ListItemIcon>
          <ListItemText primary="Schedule" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><CloudUpload /></ListItemIcon>
          <ListItemText primary="Upload CSV" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </Drawer>
    <main>
      <PinScheduler />
    </main>
  </div>
);
}

export default Dashboard;