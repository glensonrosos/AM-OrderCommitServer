import mongoose, { Schema } from 'mongoose';

const orderItemSchema = mongoose.Schema({
    poNumberId: Schema.Types.ObjectId,
    id:Schema.Types.ObjectId,
    itemCode:String,
    isRowComplete:Number,
    image:String,
    description:String,
    qty:Number,
    firstOrder:Boolean,
    patternReleasing:Date,
    productSpecs:Date,
    packagingSpecs:Date,
    firstCarcass:Date,
    completionCarcass:Date,
    firstArtwork:Date,
    completionArtwork:Date,
    firstPackagingMaterial:Date,
    completionPackagingMaterial:Date,
    carcass:Date,
    artwork:Date,
    packagingMaterial:Date,
    crd:Date,
    poptDate:Date,
    psiDate:Date,
});

const OrderItem = mongoose.model('OrderItem',orderItemSchema);

export default OrderItem;