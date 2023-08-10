import mongoose, { Schema } from 'mongoose';

const buyerSchema = mongoose.Schema({
    buyer:String,
});

const Buyer = mongoose.model('Buyer',buyerSchema);

export default Buyer;