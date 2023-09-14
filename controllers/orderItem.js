import OrderItem from "../models/orderItem.js";
import mongoose from "mongoose";

export const getOrderItem = async (req,res)=>{

    const {id} = req.params;

    try{
        // dont include image it will takes 30 seconds to get
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('no order item with that id');

        const orderItem = await OrderItem.find({poNumberId:id},{image:0});

        res.status(200).json(orderItem);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const getOrderItemForImage = async (req,res)=>{

    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('no order item with that id');

        const orderItem = await OrderItem.find({_id:id},'image');

        res.status(200).json(orderItem);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createOrderItem = async (req,res) =>{
    const orderItem = req.body;
    try{

        const newOrderItem = await new OrderItem(orderItem);

        var _id = await new mongoose.Types.ObjectId();

        newOrderItem._id = _id;
        newOrderItem.id = _id;

        await newOrderItem.save();
        res.status(201).json(newOrderItem);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const updateCellOrderItem = async (req,res) =>{
    
    const { id:_id } = req.params;
    const newOrderItem = req.body;

   try{
        if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no order item with that id');

        const updatedOrderItem = await OrderItem.
            findByIdAndUpdate(_id,newOrderItem,{new:true});

        res.json(updatedOrderItem);

   }catch(error){
        res.status(404).json({message: error.message})
   }
}

export const updateCellOrderItemImage = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {image} = req.body;

   try{
        if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no order item with that id');

        const updatedOrderItem = await OrderItem.
            findByIdAndUpdate(_id,{image},{new:true});

        res.json(updatedOrderItem);

   }catch(error){
        res.status(404).json({message: error.message})
   }
}



export const deleteOrderItem = async (req,res) =>{
    const { id:_id} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send('no order item with that id');

        const deletedOrderItem = await OrderItem.findByIdAndRemove(_id);
            
        return res.status(203).json(deletedOrderItem);
        
    }catch(error){
        res.status(409).json({message:error});
    }
}

export const getCountOrderItemStatusOpen = async (req,res) =>{
    const {id} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('no order item with that id');


        //count order details if greater to
        const totalCount = await OrderItem.find({poNumberId:id}).countDocuments();
        //get itemCode == null  = 3
        const getNull = await OrderItem.find({
            $and:[
                {poNumberId:id},
                {itemCode:{$eq:null}}
            ]}).countDocuments();
        
        if(getNull === totalCount)
            return res.status(203).json({department:"AM"});

        const statusPD = await OrderItem.find({
            $and:[
                {poNumberId:id},
                {firstOrder:true}
            ],
            $or:[
                {patternReleasing:null},
                {productSpecs:null},
                {packagingSpecs:null},
            ]
            }).countDocuments();
        if(statusPD !== 0)
            return res.status(203).json({department:"PD"});

        const statusPU = await OrderItem.find({
            poNumberId:id,
            $or:[
                {completionCarcass:null},
                {completionArtwork:null},
                {completionPackagingMaterial:null},
            ]
            }).countDocuments();

        if(statusPU !== 0)
            return res.status(203).json({department:"PU"});
        
        const statusPROD = await OrderItem.find({
            poNumberId:id,
            $or:[
                {carcass:null},
                {artwork:null},
                {packagingMaterial:null},
                {crd:null},
            ]
            }).countDocuments();
        if(statusPROD !== 0)
            return res.status(203).json({department:"PROD"});
        
        const statusQA = await OrderItem.find({
            poNumberId:id,
            $or:[
                {poptDate:null},
                {psiDate:null},
            ]
            }).countDocuments();
        if(statusQA !== 0)
            return res.status(203).json({department:"QA"});
        else
            return res.status(203).json({department:"LOGS"});
    }catch(error){
        res.status(409).json({message:error});
    }
}

