const Book = require('../models/Book');
const EmailService = require('../services/emailService');
const User = require('../models/User');

// Create a book (for admin)
exports.createBook = async (req, res) => {
    try {
        const book = new Book({
            ...req.body,
            createdBy: req.user._id,
            status: 'pending'
        });

        await book.save();

        // Get admin details for email
        const admin = await User.findById(req.user._id);

        // Notify superadmin about new book
        await EmailService.notifyBookCreation(book, admin.email, admin.name);

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Approve or reject book (for superadmin)
exports.approveBook = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.status = status;
        book.rejectionReason = rejectionReason;
        
        if (status === 'approved') {
            book.approvedBy = req.user._id;
            book.approvalDate = new Date();
        }

        await book.save();

        // Get admin who created the book
        const admin = await User.findById(book.createdBy);

        // Send email notification to admin
        await EmailService.notifyBookApprovalStatus(
            book,
            admin.email,
            status === 'approved'
        );

        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all books (modified to handle different roles)
exports.getBooks = async (req, res) => {
    try {
        let query = {};
        
        // If user is admin, show only their books
        if (req.user.role === 'admin') {
            query.createdBy = req.user._id;
        }
        // If user is regular user, show only approved books
        else if (req.user.role === 'user') {
            query.status = 'approved';
        }
        // Superadmin can see all books

        const books = await Book.find(query)
            .populate('createdBy', 'name email')
            .populate('approvedBy', 'name email');
            
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(book, req.body);
        await book.save();

        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Book.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};