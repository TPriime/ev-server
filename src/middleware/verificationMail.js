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
    subject: 'Voters Registration Successful',
    text: 'Please visit an the nearest INEC office in 2 weeks time to pick up your card'
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



