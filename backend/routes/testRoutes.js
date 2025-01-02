const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');

router.post('/test-email', async (req, res) => {
    try {
        await EmailService.sendEmail(
            req.body.email, 
            {
                subject: 'Test Email',
                html: '<h1>This is a test email</h1><p>If you receive this, the email service is working correctly!</p>'
            }
        );
        res.json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;