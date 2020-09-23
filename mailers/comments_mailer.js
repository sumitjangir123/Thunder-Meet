const nodeMailer= require('../config/nodemailer');


exports.newComment= (comment) => {
    let htmlString=nodeMailer.renderTemplate({comment: comment},'/comments/new_comments.ejs');
    nodeMailer.transporter.sendMail({
       from: 'kumarsumit16022000@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published !',
        html: htmlString
    }, (err,info) => {
        if(err){
            console.log('err in sending mail',err);return;
        }
        console.log('Message Sent', info);
        return;
    });
}
