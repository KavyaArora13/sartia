import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AppBar,
  Toolbar,
  Container,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedBookForApproval, setSelectedBookForApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setEditMode(true);
      setSelectedBook(book);
      setBookData({
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        stock: book.stock,
        category: book.category,
      });
    } else {
      setEditMode(false);
      setSelectedBook(null);
      setBookData({
        title: '',
        author: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedBook(null);
    setBookData({
      title: '',
      author: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
  };

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5001/api/books/${selectedBook._id}`,
          bookData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post('http://localhost:5001/api/books', bookData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchBooks();
      handleClose();
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // User management functions
  const handleUserDialogOpen = () => {
    setUserDialogOpen(true);
  };

  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
    setUserData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    setMessage({ type: '', text: '' });
  };

  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5001/api/users',
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage({ type: 'success', text: 'User created successfully' });
      setTimeout(handleUserDialogClose, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating user' });
    }
  };

  // Approval functions
  const handleApprovalDialogOpen = (book) => {
    setSelectedBookForApproval(book);
    setApprovalDialogOpen(true);
  };

  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    setSelectedBookForApproval(null);
    setRejectionReason('');
  };

  const handleBookApproval = async (approved) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/books/${selectedBookForApproval._id}/approve`,
        {
          status: approved ? 'approved' : 'rejected',
          rejectionReason: approved ? '' : rejectionReason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchBooks();
      handleApprovalDialogClose();
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: '#2196F3' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Welcome, {user?.name}
          </Typography>
          {user?.role === 'superadmin' && (
            <Button
              startIcon={<PersonAddIcon />}
              onClick={handleUserDialogOpen}
              sx={{
                color: 'white',
                mr: 2,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Add User
            </Button>
          )}
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Add Book
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item xs={12} sm={12} md={6} lg={4} key={book._id}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minWidth: '300px',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 2,
                      fontSize: '1.8rem'
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2,
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      fontSize: '1.1rem'
                    }}
                  >
                    by {book.author}
                  </Typography>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 3,
                      minHeight: '60px',
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }}
                  >
                    {book.description}
                  </Typography>

                  <Box 
                    sx={{ 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1.4rem'
                      }}
                    >
                      ${book.price}
                    </Typography>
                    
                    <Chip 
                      label={`Stock: ${book.stock}`}
                      size="medium"
                      sx={{ 
                        fontSize: '0.9rem',
                        padding: '8px 4px'
                      }}
                    />
                    
                    <Chip 
                      label={`Category: ${book.category}`}
                      size="medium"
                      sx={{ 
                        fontSize: '0.9rem',
                        padding: '8px 4px'
                      }}
                    />
                  </Box>

                  <Box 
                    sx={{ 
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Chip 
                      label={book.status}
                      color={
                        book.status === 'approved' ? 'success' : 
                        book.status === 'pending' ? 'warning' : 'error'
                      }
                      sx={{ 
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        padding: '8px 4px'
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {(user?.role === 'admin' || user?.role === 'superadmin') && (
                        <>
                          <IconButton 
                            onClick={() => handleOpen(book)}
                            color="primary"
                            sx={{ 
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.2)'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(book._id)}
                            color="error"
                            sx={{ 
                              backgroundColor: 'rgba(211, 47, 47, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.2)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                      
                      {user?.role === 'superadmin' && book.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprovalDialogOpen(book)}
                          sx={{ 
                            ml: 2,
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Book Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={bookData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={bookData.stock}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={bookData.category}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Add New User
          </Typography>
        </DialogTitle>
        <form onSubmit={handleUserSubmit}>
          <DialogContent>
            {message.text && (
              <Alert severity={message.type} sx={{ mb: 2 }}>
                {message.text}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              value={userData.name}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={userData.role}
                onChange={handleUserChange}
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleUserDialogClose}
              sx={{ 
                mr: 1,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                textTransform: 'none',
                fontSize: '1rem',
                px: 3
              }}
            >
              Create User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={handleApprovalDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Review Book</DialogTitle>
        <DialogContent>
          {selectedBookForApproval && (
            <>
              <Typography variant="h6">{selectedBookForApproval.title}</Typography>
              <Typography>by {selectedBookForApproval.author}</Typography>
              <Typography>{selectedBookForApproval.description}</Typography>
              <Typography>Price: ${selectedBookForApproval.price}</Typography>
              <Typography>Stock: {selectedBookForApproval.stock}</Typography>
              <Typography>Category: {selectedBookForApproval.category}</Typography>
              
              <TextField
                margin="normal"
                fullWidth
                label="Rejection Reason"
                multiline
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApprovalDialogClose}>Cancel</Button>
          <Button 
            onClick={() => handleBookApproval(false)} 
            color="error"
            disabled={!rejectionReason}
          >
            Reject
          </Button>
          <Button 
            onClick={() => handleBookApproval(true)} 
            color="primary" 
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;