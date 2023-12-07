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
    amArtwork:Number,
    patternReleasing:Date,
    productSpecs:Date,
    packagingSpecs:Date,
    pdMoldAvailability:Date,
    pdSampleReference:Date,
    firstCarcass:Date,
    completionCarcass:Date,
    firstArtwork:Date,
    completionArtwork:Date,
    firstPackagingMaterial:Date,
    completionPackagingMaterial:Date,
    puPatternAvailability:Number,
    puMoldAvailability:Number,
    carcass:Date,
    artwork:Date,
    packagingMaterial:Date,
    crd:Date,
    poptDate:Date,
    qaSampleReference:Number,
    psiDate:Date,
});

const OrderItem = mongoose.model('OrderItem',orderItemSchema);

export default OrderItem;


// db.orderitems.updateMany({},{$set:{puPatternAvailability:1}})