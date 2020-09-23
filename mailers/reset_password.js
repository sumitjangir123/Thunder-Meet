const nodeMailer= require('../config/nodemailer');

exports.reset= (resetPassword) => {
    let htmlString=nodeMailer.renderTemplate({passwordToken: resetPassword},'/reset_password/reset_password.ejs');
    nodeMailer.transporter.sendMail({
       from: 'kumarsumit16022000@gmail.com',
        to: resetPassword.user.email,
        subject: 'reset your password !',
        html: htmlString
    }, (err,info) => {
        if(err){
            console.log('err in sending mail of reset password',err);return;
        }
        console.log('Message Sent', info);
        return;
    });
}
