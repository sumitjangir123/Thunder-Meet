const nodeMailer= require('../config/nodemailer');

exports.org1= (organization) => {
    let htmlString=nodeMailer.renderTemplate({organization: organization},'/new_org/new_org.ejs');
    nodeMailer.transporter.sendMail({
       from: 'kumarsumit16022000@gmail.com',
        to: organization.admin,
        subject: 'Welcome to the world of Thunder Meet!',
        html: htmlString
    }, (err,info) => {
        if(err){
            console.log('err in sending mail',err);return;
        }
        console.log('Message Sent', info);
        return;
    });
}