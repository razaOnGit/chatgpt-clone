import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg,rgba(200, 194, 21, 0.84) 0%,rgb(95, 21, 223) 100%)`,
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 8px 32px 0 rgba(150, 39, 170, 0.53)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.01)',
    boxShadow: '0 12px 40px 0 rgba(156, 39, 176, 0.45)',
  }
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg,rgb(23, 195, 137) 30%, #673ab7 90%)`,
  border: 0,
  borderRadius: '50px',
  boxShadow: '0 3px 15px 2px rgba(156, 39, 176, 0.4)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  marginTop: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: `linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)`,
    boxShadow: '0 6px 20px rgba(156, 39, 176, 0.6)'
  },
  '&:disabled': {
    background: '#rgba(156, 39, 176, 0.5)',
  }
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '15px',
    transition: 'all 0.3s ease',
    color: '#E1BEE7', // Lighter purple text
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      transform: 'scale(1.02)',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    '&.Mui-focused': {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderWidth: '2.5px',
    },
    '&:hover fieldset': {
      borderColor: '#CE93D8', // Light purple border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E1BEE7', // Lighter purple border when focused
      borderWidth: '4px',
    }
  },
  '& .MuiInputLabel-root': {
    color: '#E1BEE7', // Lighter purple label
    transition: 'all 0.3s ease',
    '&.Mui-focused': {
      color: '#F3E5F5', // Even lighter purple when focused
      textShadow: '0 0 8px rgba(156, 39, 176, 0.6)',
      fontWeight: '500'
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#F3E5F5', // Even lighter purple input text
    fontWeight: '500',
    letterSpacing: '0.5px',
    textShadow: '0 0 1px rgba(255, 255, 255, 0.2)',
    '&::placeholder': {
      color: 'rgba(225, 190, 231, 0.6)', // Semi-transparent light purple
    },
    '&:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 30px rgba(156, 39, 176, 0.1) inset',
      '-webkit-text-fill-color': '#F3E5F5',
      'transition': 'background-color 5000s ease-in-out 0s',
    }
  },
  '& .Mui-error': {
    color: '#FF80AB', // Lighter pink for errors
    '& fieldset': {
      borderColor: '#FF80AB',
    }
  },
  // Add subtle animation for text input
  '& input': {
    transition: 'text-shadow 0.3s ease',
    '&:focus': {
      textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
    }
  }
}));