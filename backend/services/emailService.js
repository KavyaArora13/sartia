const transporter = require('../config/emailConfig');

class EmailService {
  static async sendEmail(to, template) {
    try {
      if (!to || !template) {
        throw new Error('Missing required email parameters');
      }

      const mailOptions = {
        from: `"Book Store" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: template.subject,
        html: template.html
      };

      console.log('Attempting to send email to:', to);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  static async sendUserCredentials(userDetails) {
    const template = require('../utils/emailTemplates').newUserCredentialsTemplate(
      userDetails.name,
      userDetails.email,
      userDetails.password,
      userDetails.role
    );
    return await this.sendEmail(userDetails.email, template);
  }

  static async notifyBookCreation(bookDetails, adminEmail, adminName) {
    const template = require('../utils/emailTemplates').bookCreationTemplate(
      bookDetails,
      adminName
    );
    return await this.sendEmail(process.env.SUPERADMIN_EMAIL, template);
  }

  static async notifyBookApprovalStatus(bookDetails, adminEmail, isApproved) {
    const template = require('../utils/emailTemplates').bookApprovalTemplate(
      bookDetails,
      isApproved
    );
    return await this.sendEmail(adminEmail, template);
  }
}

module.exports = EmailService;