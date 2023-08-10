import mongoose, { Schema } from 'mongoose';

const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String, 
        required:true
    },
    role:Number,
    department:{
        department: String,
        _id: mongoose.Types.ObjectId
    }
});

const User = mongoose.model('User',userSchema);

export default User;