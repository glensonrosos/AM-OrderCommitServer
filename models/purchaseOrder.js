import mongoose, { Schema } from 'mongoose';

const purchaseOrderSchema = mongoose.Schema({
    poNumber: {
        type : String , unique : true, required : true, dropDups: true 
    },
    dateIssued:{
        type : Date,required : true
    },
    buyer:{
        _id : Schema.Types.ObjectId,
        buyer:String,
    },
    shipDate:{
        type : Date , required:true
    },
    createdAt:Date,
    updatedAt:Date,
    deletedAt:Date,
    reqAttDepts:[{
        _id: Schema.Types.ObjectId,
        department: String
    }],
    status:{
        _id:Schema.Types.ObjectId,
        status:String,
        color:String,
        code:Number,
    },
    remarks:String,
    amCom:{
        editedBy:String,
        updatedAt:Date
    },
    pdCom:{
        editedBy:String,
        updatedAt:Date
    },
    puCom:{
        editedBy:String,
        updatedAt:Date
    },
    prodCom:{
        editedBy:String,
        updatedAt:Date
    },
    qaCom:{
        editedBy:String,
        updatedAt:Date
    },
    logCom:{
        editedBy:String,
        requiredShipDate:Date,
        requestedShipDate:Date,
        updatedAt:Date
    },
    editedBy:String,
});

const PurchaseOrder = mongoose.model('PurchaseOrder',purchaseOrderSchema);

export default PurchaseOrder;