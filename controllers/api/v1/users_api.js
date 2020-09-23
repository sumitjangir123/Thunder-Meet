const User= require('../../../models/user');
const jwt= require('jsonwebtoken');
const env= require('../../../config/environment');

module.exports.createSession= async function(req,res){
    try {
        
        let user=await User.findOne({email: req.body.email});

        if(!user || user.password !=req.body.password){
            return res.status(422).json({
                message: 'Invalid User Name Or Password !'
            });
        }
        return res.status(200).json({
            message: 'Sign In successful, here is your token, Please Keep It safe',
            data:{
                token: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn: '100000'})
            }
        });
    } catch (error) {
        console.log('*****',error);
        return res.status(500).json({
            message: 'Internal Server Error !'
        });
    }
}