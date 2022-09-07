const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keysecret = "souratripathiakashtripathigolutripathigaurav";

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

//defining schema for files upload

const userData = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    date:{
        type:Date
    },
    code:{
        type:String,
        required:true
    }
})

//creating model for file upload

const userfile = new mongoose.model("usersdata",userData);


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.cpassword,10);
    }
    

    next();
})

//generating token

userSchema.methods.generateAuthtoken =async function (){
        try {
            const token = jwt.sign({_id:this._id},keysecret,{
                expiresIn:"1d"
            })

            this.tokens = this.tokens.concat({token:token});
            await this.save();
            return token;
        } catch (error) {
            res.status(422).json(error);
        }
}


//creating model

const userdb = new mongoose.model('validusers',userSchema);


module.exports = {userdb,userfile}; 