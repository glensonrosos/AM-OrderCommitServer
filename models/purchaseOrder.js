import mongoose from 'mongoose';

const purchaseOrderSchema = mongoose.Schema({
    poNumber: String,
});

const PurchaseOrder = mongoose.model('PurchaseOrder',purchaseOrderSchema);

export default PurchaseOrder;