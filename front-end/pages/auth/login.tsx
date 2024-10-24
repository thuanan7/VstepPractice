import React from 'react';
import {Box, Button, TextField, Typography, Paper, Grid} from '@mui/material';
import backgroundImage from '@/assets/background_1.webp';

const Login: React.FC = () => {
    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <Grid item xs={false} sm={4} md={7} sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} display={'flex'} square
                  alignItems={'center'} justifyContent={'center'}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: 2,
                    p: 4,
                }}>

                    <Typography component="h1" variant="h4" color="primary" sx={{ mb: 2 }}>
                        VSTEP B1 Test
                    </Typography>
                    <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Hãy đăng nhập để tiếp tục bài thi VSTEP B1. Đây là bước đầu tiên trong hành trình đánh giá khả năng tiếng Anh của bạn.
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            color="primary"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            color="primary"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login;
