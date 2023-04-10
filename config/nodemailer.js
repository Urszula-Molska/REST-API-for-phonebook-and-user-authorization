const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.wp.pl",
  port: 465,
  secure: true,
  auth: {
    user: "urszula_molska",
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = (verificationToken, emailTo) => {
  const verificationLink = `http://localhost:3000/api/users/verify/${verificationToken}`;

  const emailOptions = {
    from: "urszula_molska@wp.pl",
    to: emailTo,
    subject: "Verification test",
    html: `<h1>Please verify your email adress by clicking verification link below<h1>
  <div><a href='${verificationLink}'>verification link</a></div>`,
  };

  transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = { sendEmail };
