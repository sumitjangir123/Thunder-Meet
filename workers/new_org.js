const queue= require('../config/kue');
const newOrgMailer= require('../mailers/new_org');

queue.process('orgQueue',function(job,done){
    console.log('new organization worker is processing a job ',job.data);
    newOrgMailer.org1(job.data);
    done();
});