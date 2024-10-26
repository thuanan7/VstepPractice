import React from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material'
import backgroundImage from '@/assets/background_1.webp'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
})

const Login: React.FC = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = (data) => {
    console.log('Thông tin đăng nhập:', data)
    // Xử lý đăng nhập tại đây
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        display={'flex'}
        square
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '400px',
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            color="primary"
            sx={{ mb: 2 }}
          >
            VSTEP B2 Test
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Hãy đăng nhập để tiếp tục bài thi VSTEP B2. Đây là bước đầu tiên
            trong hành trình đánh giá khả năng tiếng Anh của bạn.
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              onClick={() => {
                navigate('/admin')
              }}
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
  )
}

export default Login
