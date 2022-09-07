
const jwt = require('jsonwebtoken');
const {userdb} = require('../model/userSchema');
const keysecret = "souratripathiakashtripathigolutripathigaurav"; 

const authorize = async(req,res,next) => {
    try {
        const token = req.headers.authorization;
        // console.log(token);

        const verifyUser = jwt.verify(token,keysecret);
        // console.log(verifyUser);

        const rootUser = await userdb.findOne({_id:verifyUser._id});
        // console.log(rootUser);
        if(!rootUser){
            throw new Error('user not found');
        }

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    } catch (error) {
        res.status(401).json({status:401,message:"unauthorized no token provided"})
    }
}

module.exports = authorize;