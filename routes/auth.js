//file for the authentication. mapped to endpoints
const express = require('express')
const router = express.Router()

const User = require('../models/User')


const {registerValidation, loginValidation, postValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

 
router.post('/register', async(req, res)=>{
    
    //validation 1 to check user input. validate body given by user
    //jump directly to the error i.e avoid the value
    const {error} = (registerValidation(req.body))
    if(error){
       return  res.status(400).send({message: error['details'][0]['message']})
    }
    //validation 2 to check if user exist
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
       return res.status(400).send({message:'user already exist'})
    }
    //add randomness and generate complexity of the key. 5 random num give complexity of hash
    //created a hashed representation of password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)
   //code to insert data
    const user = {
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    };
    try{
       await User.insertMany(user);
      res.status(200).send({
        message:"register Successfully"
      })
    }catch(err){
       res.status(400).send({message:err})
    }
  })

router.post('/login', async(req, res)=>{
    //check user input in terms of validation, password is fine then login
     //validation 1 to check user input
     const {error} = (loginValidation(req.body))
     if(error){
        return  res.status(400).send({message: error['details'][0]['message']})
     }
     //validation 2 to check if user exist
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'user does not exist'})
    }
     //validation 3 to check if user password is correct . decrypt and check password
     //compare given pw to stored pw
     const passwordValidation = await bcryptjs.compare(req.body.password,user.password)  
     if(!passwordValidation){
        return res.status(400).send({message:'password is wrong'})
     }
    //generate an auth token for the user
    //use the user id to create the token
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
    //send token as header and in thee body. 
})
module.exports=router

