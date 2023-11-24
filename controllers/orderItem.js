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

export const updateCellOrderItemWithItemCode = async (req,res)=>{

    const {id} = req.params;
    const {itemCode} = req.body;

    try{

        if(!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('no order item with that id');

        const orderItem = await OrderItem.findOne({itemCode},{sort:{_id:-1},itemCode:1,image:1,description:1,amArtwork:1});

        if(!orderItem){
            const dontExist = await OrderItem.
            findByIdAndUpdate({_id:id},{
                itemCode:itemCode,
                image:null,
                description:null,
                amArtwork:1,
            },{new:true,projection: { image: 0 }});  

            return res.status(201).json({orderItem:dontExist,message:'no order item with that item code'});
        }
        const updatedOrderItem = await OrderItem.
            findByIdAndUpdate({_id:id},{
                itemCode:orderItem.itemCode,
                image:orderItem.image,
                description:orderItem.description,
                amArtwork:orderItem.amArtwork,
            },{new:true,projection: { image: 0 }});  

        return res.status(201).json({orderItem:updatedOrderItem,message:"success"});
    }catch(error){
        return res.status(404).json({message: error});
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
                {itemCode:null},
            ]}).countDocuments();

        if(parseInt(getNull) === 0 && parseInt(totalCount) === 0){
            console.log('--1department:"AM"');
            return res.status(203).json({department:"AM"});
        }
        if(parseInt(getNull) > 0){
            console.log('--2department:"AM"');
            return res.status(203).json({department:"AM"});
        }
        
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
        if(statusPD !== 0){
            console.log('--1department:"PD"');
            return res.status(203).json({department:"PD"});
        }

        const statusPDMold = await OrderItem.find({
            $and:[
                {poNumberId:id},
                {puMoldAvailability:0}
            ],
            $or:[
                {pdMoldAvailability:null},
            ]
            }).countDocuments();

        if(statusPDMold !== 0){
            console.log(`--2department:"PD" | ${statusPDMold}`);
            return res.status(203).json({department:"PD"});
        }

        const statusPDSample = await OrderItem.find({
            $and:[
                {poNumberId:id},
                {qaSampleReference:0}
            ],
            $or:[
                {pdSampleReference:null},
            ]
            }).countDocuments();

        if(statusPDSample !== 0){
            console.log('--3department:"PD"');
            return res.status(203).json({department:"PD"});
        }


        const statusPU = await OrderItem.find({
            poNumberId:id,
            $or:[
                {completionCarcass:null},
                //{completionArtwork:null},
                {completionPackagingMaterial:null},
                {puMoldAvailability:-1},
            ]
            }).countDocuments();

        if(statusPU !== 0){
            console.log('--department:"PU"');
            return res.status(203).json({department:"PU"});
        }
        
        // skip pu artwork
        const statusPUArtwork = await OrderItem.find({
            $and:[
                {poNumberId:id},
                {amArtwork:1}
            ],
            $or:[
                {completionArtwork:null},
            ]
            }).countDocuments();

        if(statusPUArtwork !== 0){
            console.log('--department:"AM"');
            return res.status(203).json({department:"PU"});
        }
        // skip pu artwork

        const statusPROD = await OrderItem.find({
            poNumberId:id,
            $or:[
                {carcass:null},
                //{artwork:null},
                {packagingMaterial:null},
                {crd:null},
            ]
            }).countDocuments();
        if(statusPROD !== 0){
            console.log('--department:"PROD"');
            return res.status(203).json({department:"PROD"});
        }

        // skip prod artwork
        const statusPRODArtwork = await OrderItem.find({
        $and:[
            {poNumberId:id},
            {amArtwork:1}
        ],
        $or:[
            {artwork:null},
        ]
        }).countDocuments();

        if(statusPRODArtwork !== 0){
            console.log('--department:"PROD"');
            return res.status(203).json({department:"PROD"});
        }
        // skip prod artwork
        
        const statusQA = await OrderItem.find({
            poNumberId:id,
            $or:[
                {qaSampleReference:-1},
                {psiDate:null},
            ]
            }).countDocuments();

        if(statusQA !== 0){
            console.log('--department:"QA"');
            return res.status(203).json({department:"QA"});
        }else{
            console.log('--department:"LOGS"');
            return res.status(203).json({department:"LOGS"});
        }
    }catch(error){
        res.status(409).json({message:error});
    }
}


export const updateOrderItemInBulk = async (req,res) =>{
    
    const { ids, column, val } = req.body;
    const areAllValidObjectIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));

    try {
      if (!areAllValidObjectIds)
            return res.status(404).send('No order item with that id');
    
      let getIdsWithNullValues = null;
    
      if(column === 'puMoldAvailability' || column === 'qaSampleReference') {
        const pdYesNo = await OrderItem.updateMany(
            { _id: { $in: ids } },
            { [column]: Number(val) },
            { new: true }
          );
          return res.status(203).json(pdYesNo);
      }
    
      getIdsWithNullValues = await OrderItem.find({
        _id: { $in: ids },
        [column]: null,
      }, { _id: 1 });
  
      const updateDates = await OrderItem.updateMany(
        { _id: { $in: getIdsWithNullValues } },
        { [column]: val },
        { new: true }
      );
  
      return res.status(203).json(updateDates);
    
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
}

export const clearDateOrderItemInBulk = async (req,res) =>{
    
    const { ids, column } = req.body;
    const areAllValidObjectIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));

    try {
      if (!areAllValidObjectIds)
            return res.status(404).send('No order item with that id');
    
      const updateDates = await OrderItem.updateMany(
        { _id: { $in: ids } },
        { [column]: null },
        { new: true }
      );
  
      return res.status(203).json(updateDates);
    
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
}
