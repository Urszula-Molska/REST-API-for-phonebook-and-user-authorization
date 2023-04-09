const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

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
  const verificationLink = `https://api/users/verify/:${verificationToken}`;
  console.log({ verificationLink });

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
