import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f4f6f8',
        padding: 3,
      }}
    >
      <Typography
        variant="h1"
        component="div"
        sx={{ fontWeight: 'bold', color: 'primary' }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ marginTop: 2, color: '#555' }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 1, color: '#777' }}>
        It might have been removed, renamed, or didn't exist in the first place.
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            padding: '10px 20px',
            fontSize: '16px',
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}

export default NotFoundPage
