import { createTheme } from '@mui/material/styles';

// Color palette as per your requirements
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6fa5', // Blueberry
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb347', // Apricot
      contrastText: '#333',
    },
    warning: {
      main: '#ffd166', // Citrus
      contrastText: '#333',
    },
    success: {
      main: '#7ec850', // Applecore (a fresh green)
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
