import mongoose, { Schema } from 'mongoose';

const statusSchema = mongoose.Schema({
    status:{
        status:String,
        code:Number,
        color:String
    }
});

const Status = mongoose.model('Status',statusSchema);

export default Status;