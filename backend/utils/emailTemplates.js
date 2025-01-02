exports.newUserCredentialsTemplate = (name, email, password, role) => ({
    subject: 'Your Account Credentials',
    html: `
      <h1>Welcome to Book Store</h1>
      <p>Hello ${name},</p>
      <p>Your account has been created with the following credentials:</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>Role: ${role}</p>
      <p>Please change your password after first login.</p>
    `
  });
  
  exports.bookCreationTemplate = (bookDetails, adminName) => ({
    subject: 'New Book Added for Approval',
    html: `
      <h1>New Book Added</h1>
      <p>Admin ${adminName} has added a new book:</p>
      <p>Title: ${bookDetails.title}</p>
      <p>Author: ${bookDetails.author}</p>
      <p>Category: ${bookDetails.category}</p>
      <p>Price: $${bookDetails.price}</p>
      <p>Please review and approve/reject this book.</p>
    `
  });
  
  exports.bookApprovalTemplate = (bookDetails, isApproved) => ({
    subject: `Book ${isApproved ? 'Approved' : 'Rejected'}`,
    html: `
      <h1>Book ${isApproved ? 'Approved' : 'Rejected'}</h1>
      <p>Book: ${bookDetails.title}</p>
      <p>Status: ${isApproved ? 'Approved' : 'Rejected'}</p>
      ${!isApproved ? '<p>Please review and update the book details.</p>' : ''}
    `
  });