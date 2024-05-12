const transporter = require('../config/mailConfig');

const sendMail = async (to, subject, text) => {
    try {
      const transport = transporter();
        const info = await transport.sendMail({
          from: process.env.MAIL_USERNAME,
          to: to,
          subject: subject,
          text: text
        });
        console.log('Message sent: %s', info.messageId);
      } catch (error) {
        console.error('Error occurred while sending email:', error);
      }
}

module.exports = {sendMail}