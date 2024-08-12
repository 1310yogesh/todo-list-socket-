const nodemailer = require('nodemailer');

const sendMail = async (sendTo, taskId, task) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test.nodemailer@gmail.com', // only accept org mails
            pass: 'Nodemailer123'
        },
    });
    const mailOptions = {
        from: 'test.nodemailer@gmail.com',
        to: sendTo,
        subject: "Reminder: Today is the Last Day to Complete Your Task",
        text: `Dear User,

        This is a reminder that today is the last day to complete your task.
        
        Task ID: ${taskId}
        Task: ${task}
        
        Please make sure to close this task as soon as possible.
        
        Thank you.`,
    };
    transporter.sendMail(mailOptions, (error, email) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', email.response);
        }
    });
    return true;
};

module.exports = { sendMail };


