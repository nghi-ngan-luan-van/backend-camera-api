const nodemailer = require('nodemailer');
const config = require('./config');
const auth = {
    service: 'Gmail',
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: config.user,
        pass: config.pass,
    },
    tls: { rejectUnauthorized: false }
};
const sendMail = async (email, subject, text, cb) => {
    let transporter = nodemailer.createTransport(auth);
    const mailOptions = {
        from: config.user,
        to: email,
        subject,
        text
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
    transporter.close();
};
module.exports = sendMail;
//# sourceMappingURL=mailer.js.map