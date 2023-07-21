import PurchaseOrder from "../models/purchaseOrder.js";

export const getPurchaseOrders = async (req,res)=>{
    try{
        const purchaseOrder = await PurchaseOrder.find();

        console.log(purchaseOrder);

        res.status(200).json(purchaseOrder);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createPurchaseOrder = (req,res) =>{
    res.send('POST CREATION');
}
