const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('./constanst');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = sgMail;


