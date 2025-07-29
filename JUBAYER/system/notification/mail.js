const logger = require('../../catalogs/Jubayerc.js');
const nodemailer = require('nodemailer');
const config = require('../../../Jubayer.json');
const target = config.EMAIL;

module.exports = async (subject, message) => {
    // Check if message is provided
    if (!message) {
        return logger.err('please provide a notification message!');
    }

    // Convert subject to uppercase if it's a string
    let formattedSubject = typeof subject === 'string' || subject instanceof String 
        ? subject.toUpperCase() 
        : subject;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jubayer.xhmed.reham@gmail.com',
            pass: 'diug cuqe rmwv wcta'
        }
    });

    // Email options
    const mailOptions = {
        from: 'jubayer.xhmed.reham@gmail.com',
        to: target,
        subject: `JUBAYER BOT NOTIFICATION ( ${formattedSubject} )`,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.err('something went wrong when sending notification.');
        }
        // No success logging implemented
    });
};
