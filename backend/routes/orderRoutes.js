const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createOrder,
    getAllOrders,
    getUserOrders
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, authorize('superadmin'), getAllOrders);
router.get('/my-orders', protect, getUserOrders);

module.exports = router;