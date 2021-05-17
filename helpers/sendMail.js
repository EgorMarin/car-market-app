const sendGrid = require('../config/sendgrid')

const sendMail = ({ to, subject, html }) => {
  sendGrid.send({
    from: `daggle603@gmail.com`,
    to,
    subject,
    html,
  })
  .then(() => {
    // console.log('Email sent');
  })
  .catch(() => {
    // console.error(error);
  });

}

module.exports = sendMail