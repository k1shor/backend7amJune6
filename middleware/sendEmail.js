const nodemailer = require('nodemailer')

const sendEmail = mailOptions => {
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "98d01484d2ca26",
        pass: "e75a30a02b5212"
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // auth: {
        //   user: process.env.SMTP_USER,
        //   pass: process.env.SMTP_PASS
        }
      });

      transport.sendMail({
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html
    })
}

module.exports = sendEmail