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
        code:Number
    },
    remarks:String,
    pdCom:{
        status:String,
        finish:Date,
        editedBy:String
    },
    puCom:{
        status:String,
        finish:Date,
        editedBy:String
    },
    prodCom:{
        status:String,
        finish:Date,
        editedBy:String
    },
    qaCom:{
        status:String,
        finish:Date,
        editedBy:String
    },
    logCom:{
        status:String,
        finish:Date,
        editedBy:String,
        requiredShipDate:Date,
        requestedShipDate:Date
    },

});

const PurchaseOrder = mongoose.model('PurchaseOrder',purchaseOrderSchema);

export default PurchaseOrder;