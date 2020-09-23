const queue= require('../config/kue');
const commentsMailer= require('../mailers/reset_password');

queue.process('passQueue',function(job,done){
    console.log('reset_passwords worker is processing a job ',job.data);
    commentsMailer.reset(job.data);
    done();
});