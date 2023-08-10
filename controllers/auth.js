import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signIn = async (req,res)=>{

    const {username,password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(!existingUser) 
            return res.status(404).json({message:"User dont exist"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect)
            return res.status(400).json({message:"Invalid credentials"});

        const token = jwt.sign({username: existingUser.username, id: existingUser._id, 
            role: existingUser.role,department: existingUser.department }
            ,'glensonSalt',{expiresIn: "1h"});

        return res.status(200).json({result: existingUser, token});

    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const signUp = async (req,res) =>{
    const { username, password, firstname, lastname, role, department} =  req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser)
            return res.status(400).json({message: "User already exist"});
        
        const hashedPassword = await bcrypt.hash(password,12);
        const newUser = await User.create({username,password: hashedPassword,
            firstname,lastname, role, department});
        
        const token = jwt.sign({username: newUser.username, id: newUser._id, 
            role: newUser.role,department: newUser.department }
            ,'glensonSalt',{expiresIn: "1h"});
        
        return res.status(200).json({result: newUser, token});

    }catch(error){
        res.status(404).json({message: error.message});
    }
}
