const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// All routes require authentication and superadmin role
router.use(protect, authorize('superadmin'));

// User routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;