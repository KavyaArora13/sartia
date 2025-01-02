const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.sendBookCreationEmail = async (superAdminEmail, bookDetails, adminName) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: superAdminEmail,
            subject: 'New Book Created - Approval Required',
            html: `
                <h2>New Book Created</h2>
                <p>Admin ${adminName} has created a new book:</p>
                <ul>
                    <li>Title: ${bookDetails.title}</li>
                    <li>Author: ${bookDetails.author}</li>
                    <li>Price: $${bookDetails.price}</li>
                </ul>
                <p>Please review and approve/reject this book.</p>
            `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

exports.sendBookApprovalEmail = async (adminEmail, bookDetails, isApproved) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: adminEmail,
            subject: `Book ${isApproved ? 'Approved' : 'Rejected'}`,
            html: `
                <h2>Book ${isApproved ? 'Approved' : 'Rejected'}</h2>
                <p>Your book "${bookDetails.title}" has been ${isApproved ? 'approved' : 'rejected'}.</p>
                ${!isApproved ? '<p>Please contact the super admin for more details.</p>' : ''}
            `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

exports.sendUserCredentials = async (email, password, role) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your Account Credentials',
            html: `
                <h2>Welcome to Sartia Books</h2>
                <p>Your account has been created with the following credentials:</p>
                <ul>
                    <li>Email: ${email}</li>
                    <li>Password: ${password}</li>
                    <li>Role: ${role}</li>
                </ul>
                <p>Please change your password after your first login.</p>
            `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

exports.sendOrderNotification = async (superAdminEmail, orderDetails, userEmail) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: superAdminEmail,
            subject: 'New Book Order',
            html: `
                <h2>New Order Received</h2>
                <p>A new order has been placed by user: ${userEmail}</p>
                <h3>Order Details:</h3>
                <ul>
                    <li>Book: ${orderDetails.book.title}</li>
                    <li>Quantity: ${orderDetails.quantity}</li>
                    <li>Total Price: $${orderDetails.totalPrice}</li>
                </ul>
            `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};