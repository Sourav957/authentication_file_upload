const express = require('express');
const router = express.Router();
const {userdb}  = require('../model/userSchema');
const bcrypt = require('bcryptjs');
const authorize = require('../middlewares/authorize');
const {userfile} = require('../model/userSchema');
const multer = require('multer');
const moment = require('moment');


//storage for multer
const fileconfig = multer.diskStorage({
    destination:(req,file,callback) =>{
        callback(null,'./uploads');
    },
    filename:(req,file,callback) => {
        callback(null,`image-${Date.now()}. ${file.originalname}`);
    }
})

//filefilter not defined  

//defining multer

const upload = multer({
    storage:fileconfig
})

//routes

router.post('/register',async(req,res) => {
   
    const {fname,email,password,cpassword} = req.body;
    if(!fname || !email || !password || !cpassword){
        res.status(422).json({error:"please fill all the fields"})
    }else if(password !== cpassword){
        res.status(422).json({error:'password and confirm password doesnt match'});
    }else{
            try {
                const preUser = await userdb.findOne({email:email});
                if(preUser){
                    res.status(422).json({error:"email already exists"});
                }else if(password !== cpassword){
                    res.status(422).json({error:'password and confirm password doesnt match'});
                }else{
                    const finalUser = new userdb({
                        fname,email,password,cpassword
                    })
    
                    //password hashing performed in userSchema module

                    const storeData = await finalUser.save();
                    // console.log(storeData);
                    //response sent back to user

                    res.status(201).json({status:201,storeData});
                }
        
               

            } catch (error) {
                console.log(error);
            }
       

    }
})

//route for user login

router.post('/login',async(req,res) => {
   const {email,password} = req.body;

   if(!email || !password){
    res.status(422).json({error:"please enter valid information"})
   }

   try {
    const validUser = await userdb.findOne({email:email});
    if(validUser){
        const isMatch = await bcrypt.compare(password,validUser.password);
        if(!isMatch){
            res.status(422).json({error:"invalid details"});
        }else{

            //generate token

            const token = await validUser.generateAuthtoken();
            // console.log(token);

            //cookie generation
           res.cookie("usercookie",token,{
            expires:new Date(Date.now() + 9000000),
            httpOnly:true   
           })

           const result = {
            validUser,
            token
           }

           res.status(201).json({status:201,result});
        } 
    }
   } catch (error) {
   res.status(401).json({error:error});
   }
})

//creating validuser API

router.get('/validuser',authorize,async(req,res) => {
 try {
    const validUserOne = await userdb.findOne({_id:req.userId});
    res.status(201).json({status:201,validUserOne});
 } catch (error) {
    res.status(401).json({status:401,error});
 }
})



//api for file upload data

router.post('/uploadfile',upload.single("file"),async(req,res) => {
    const {filename} = req.file;
    const {Uname} = req.body;

    if(!filename || !Uname){
        res.status(401).json({status:401,message:"please fillout all the fields"});
    }

    try {
        //code to generate random number
        const number1 = Math.floor(Math.random() * (9999 - 1 + 1) + 1);
        const number2 = Math.floor(Math.random() * (999 - 1 + 1) + 1);
        const mycode = '' + number1 + number2;
        const date = moment(new Date()).format('YYYY-MM-DD');
        const userdata = new userfile({
            filename:Uname,
            file:filename,
            date:date,
            code:mycode
            
        })

        const finaldata = await userdata.save();
        res.status(201).json({status:201,finaldata});
    } catch (error) {
        res.status(401).json({status:401,message:error});
    }

})



module.exports = router;