const nodemailer = require('nodemailer');
const transporter = () => {
  return nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });
}

module.exports = transporter;
