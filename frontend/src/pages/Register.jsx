import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
} from '@mui/material';
import { register } from '../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1FC6F3', // Light grey background
        backgroundImage: 'none', // Subtle gradient
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, md: 6 }, // Responsive padding
            width: '100%',
            maxWidth: 600,
            mx: 'auto', // Center horizontally
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.98)', // Slightly transparent white
            backdropFilter: 'blur(10px)', // Frosted glass effect
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
        >
          <Typography 
            component="h1" 
            variant="h3" 
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                fontSize: '1rem'
              }}
            >
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <TextField
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px',
                  fontSize: '1rem',
                }
              }}
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px',
                  fontSize: '1rem',
                }
              }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px',
                  fontSize: '1rem',
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 2,
                py: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                }
              }}
            >
              Sign Up
            </Button>

            <Box 
              sx={{ 
                mt: 3,
                textAlign: 'center'
              }}
            >
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body1"
                sx={{
                  color: '#2196F3',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#1976D2'
                  }
                }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;