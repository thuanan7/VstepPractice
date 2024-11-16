import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      light: '#EED2EE',
      main: '#D8BFD8',
      dark: '#CDA0C5',
    },
    secondary: {
      light: '#F0E6FA',
      main: '#E6E6FA',
    },
    background: {
      default: '#F8F8FF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#6C3483',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      color: '#2C3E50',
    },
    body1: {
      color: '#2C3E50',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
        containedPrimary: {
          backgroundColor: '#D8BFD8',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#CDA0C5',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#D8BFD8',
            },
            '&:hover fieldset': {
              borderColor: '#CDA0C5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#CDA0C5',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#D8BFD8',
            '&.Mui-focused': {
              color: '#CDA0C5',
            },
          },
        },
      },
    },
  },
})

export default theme
