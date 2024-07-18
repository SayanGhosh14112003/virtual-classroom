import React from 'react';
import { Card, CardContent, Typography, Avatar} from '@mui/material';
import {makeStyles} from '@mui/styles';
import { useAuth } from './context';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    margin: 'auto',
    marginTop: 20,
  },
  avatar: {
    width: 100, 
    height: 100,
    margin: 'auto',
    marginBottom: 10, 
  },
});

const UserCard = ({ photo, name, email }) => {
  const classes = useStyles();
  const {auth}=useAuth()
  return (
    <Card className={classes.card}>
      <CardContent>
        <Avatar src={auth?.photoURL} className={classes.avatar} />
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          {auth?.displayName}
        </Typography>
        <Typography color="textSecondary" align="center" gutterBottom>
          {auth?.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
