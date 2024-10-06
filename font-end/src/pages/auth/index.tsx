import * as React from 'react';
import { Alert, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Fragment, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { loginSync, selectAuth } from '@/features/auth/authSlice';
import { Navigate } from 'react-router-dom';

export default function SignIn() {
  const dispatch = useAppDispatch();
  const { isLoading, errorMsg, accessToken } = useAppSelector(selectAuth);
  const [username, setUsername] = useState('admin');

  const [password, setPassword] = useState('admin@123');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username !== '' && password !== '') {
      dispatch(loginSync(username, password));
    }
  };
  if (accessToken) {
    return <Navigate to={'/admin'} />;
  }
  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          onChange={e => {
            setUsername(e.target.value);
          }}
          margin="normal"
          required
          fullWidth
          value={username}
          id="username"
          label="User name"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          onChange={e => {
            setPassword(e.target.value);
          }}
          fullWidth
          value={password}
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Box height={50}>{errorMsg && <Alert severity="error">{errorMsg}</Alert>}</Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          Sign In {isLoading ? 'loading' : ''}
        </Button>
      </Box>
    </Fragment>
  );
}
