const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('--- Email Setup Audit ---');
  console.log('USER:', process.env.EMAIL_USER);
  console.log('PASS:', process.env.EMAIL_PASS ? '******** (Set)' : '(Not Set)');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Audit Test" <${process.env.EMAIL_USER}>`,
    to: 'Gurukulclasses001@gmail.com',
    subject: 'System Audit: Email Connectivity Test',
    text: 'If you see this, your Gmail SMTP connection is working correctly.'
  };

  try {
    console.log('Attempting to send test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('SUCCESS!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('FAILED!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.message.includes('Invalid login')) {
        console.log('\nHINT: This usually means your Google App Password is wrong or revoked.');
    }
  }
}

testEmail();
