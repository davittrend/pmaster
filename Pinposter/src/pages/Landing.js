import React from 'react';
import { Link } from 'react-router-dom';
import {
AppBar,
Toolbar,
Typography,
Button,
Container,
} from '@material-ui/core';

function Landing() {
return (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Mighty Pinner
        </Typography>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
      </Toolbar>
    </AppBar>
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Manage Your Pinterest Content
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Schedule, organize, and automate your Pinterest content with ease
      </Typography>
    </Container>
  </>
);
}

export default Landing;