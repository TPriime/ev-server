import nodemailer from 'nodemailer';
import secrets from './ENV.json';

export const sendVerificationMail = userEmail => {
    
    const transporter = nodemailer.createTransport({
        service: secrets.emailServiceProvider,
        auth: {
        user: secrets.emailUserName,
        pass: secrets.emailUserPassword
        }
    });

    const mailOptions = {
    from: secrets.emailUserName,
    to: userEmail,
    subject: 'LnQ Account Verification',
    text: 'Please verify your account'
  };

    transporter.sendMail(mailOptions, (e, info) => {
        if (e) {
        // return(e);
        console.log(e);
        } else {
        return(`Email sent: ${info.response}`);
        // return true;
        }
  });  
}



