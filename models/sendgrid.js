require('dotenv').config();
var sgMail = require('@sendgrid/mail');
module.exports = {
  // メール送信
  send: function(to, from, subject, text) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    var msg = {
      to: to,
      from: from,
      subject: subject,
      text: text
    };
    return Promise.resolve(sgMail.send(msg));
  }
};
