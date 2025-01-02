const Order = require('../models/Order');
const Book = require('../models/Book');

exports.createOrder = async (req, res) => {
    try {
        const book = await Book.findById(req.body.book);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Calculate total price
        const totalPrice = book.price * req.body.quantity;

        // Create order
        const order = new Order({
            book: req.body.book,
            user: req.user._id,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            quantity: req.body.quantity,
            totalPrice: totalPrice
        });

        await order.save();

        // Update book stock (optional)
        book.stock -= req.body.quantity;
        await book.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (for superadmin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('book')
            .populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('book');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};