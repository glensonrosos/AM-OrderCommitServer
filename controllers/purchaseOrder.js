import PurchaseOrder from "../models/purchaseOrder.js";
import mongoose from "mongoose";

export const getPurchaseOrders = async (req,res)=>{
    try{
        const purchaseOrders = await PurchaseOrder.find();

        console.log(purchaseOrders);

        res.status(200).json(purchaseOrders);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const getPurchaseOrder = async(req,res)=>{
    try{
        const {id} = req.params;
        const purchaseOrder = await PurchaseOrder.find({_id:id});
        res.status(200).json(purchaseOrder);

    }catch(error){
        res.status(401).json({message:error.message});
    }
}

export const createPurchaseOrder = async (req,res) =>{

    const poDetails = req.body;

    const newPo = new PurchaseOrder({
        ...poDetails,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        reqAttDepts:[],
        status:{
            _id:"64cb742f6dec3a86e635ce26",
            status:"Open",
            color:"error",
            code:0
        },
        remarks:null,
        pdCom:{
            status:"open",
            finish:null,
            editedBy:null
        },
        puCom:{
            status:"open",
            finish:null,
            editedBy:null
        },
        prodCom:{
            status:"open",
            finish:null,
            editedBy:null
        },
        qaCom:{
            status:"open",
            finish:null,
            editedBy:null
        },  
        logCom:{
            status:"open",
            finish:null,
            editedBy:null,
            requiredShipDate:null,
            requestedShipDate:null
        }
        });

    try{
        await newPo.save();
        res.status(201).json(newPo);

    }catch(error){
        res.status(409).json({message:error})
    }
}


export const updatePurchaseOrderByAM = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {dateIssued,buyer,poNumber,shipDate,status,reqAttDepts,remarks} = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');

    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,{dateIssued,buyer,poNumber,shipDate,status,reqAttDepts,remarks,_id},{new:true});

    console.log(updatedPurchaseOrder);

    res.json(updatedPurchaseOrder);
}

export const updatePurchaseOrderByLogistics = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {logRequiredShipDate, logRequestedShipDate} = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');
    
    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,{
            logCom:{
                requiredShipDate: logRequiredShipDate,
                requestedShipDate: logRequestedShipDate
            },_id},{new:true});

    console.log(updatedPurchaseOrder);

    res.json(updatedPurchaseOrder);
}
