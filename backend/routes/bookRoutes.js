const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createBook,
    getBooks,
    approveBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

// Get books (accessible by all authenticated users)
router.get('/', protect, getBooks);

// Create book (admin only)
router.post('/', protect, authorize('admin'), createBook);

// Approve/reject book (superadmin only)
router.patch('/:id/approve', protect, authorize('superadmin'), approveBook);

// Update book (admin only)
router.put('/:id', protect, authorize('admin'), updateBook);

// Delete book (admin and superadmin)
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBook);

module.exports = router;