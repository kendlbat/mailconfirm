const nodemailer = require('nodemailer');
const dbhandler = require('../db/dbhandler');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log("Mail credentials: " + process.env.EMAILUSER + " " + process.env.EMAILPASS);

async function sendConfirmation(hash) {
    const mail = await dbhandler.getByHash(hash);
    if (!mail) {
        console.warn("No mail found for hash " + hash);
        return false;
    }
    
    const mailOptions = {
        from: process.env.EMAILUSER,
        to: mail.reciever,
        subject: `READ: ${mail.subject}`,
        html: `<h1>READ RECIEPT</h1><p>The email with the subject:<br><b>${mail.subject}</b><br>has been read by: <br>${mail.reciever}</p><p>You can now delete this email.</p>`
    };
    
    let tries = 0;
    let retryInterval = setInterval(() => {
        transporter.sendMail(mailOptions, function(error, info){
            tries++;
            if (error) {
                console.log(error);
                if (tries > 10) {
                    clearInterval(retryInterval);
                }
            } else {
                console.log('Email sent: ' + info.response);
                clearInterval(retryInterval);
            }
        });
    }, 60000);

    dbhandler.removeByHash(hash);
    return true;
}

module.exports = {
    sendConfirmation
}