import PurchaseOrder from "../models/purchaseOrder.js";
import mongoose from "mongoose";
import moment from 'moment';

export const getPurchaseOrders = async (req,res)=>{
    const {page} = req.query;
    try{

        const LIMIT = 3 ;
        //get the starting index of evert page;
        const startIndex = ( Number(page)-1 ) * LIMIT;
        const total = await PurchaseOrder.countDocuments({});

        const data = await PurchaseOrder.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({purchaseOrders: data, 
            currentPage:(Number(page)), numberOfPages:Math.ceil(total/ LIMIT) });
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

// Query =>    /posts?page=1    page=1
// Params =>    /post/123sfs    id=123sfs

export const getPurchaseOrdersBySearch = async (req,res)=>{
    try{
        const {option,value} = req.query;

        let purchaseOrders = [];

        if(option === 'shipDate' || option === 'dateIssued'){
            //DATE

            if(value.split('-').length > 1){

                let dateFrom = null;
                let dateTo = null;

                dateFrom = value.split('-')[0] || null;
                dateTo = value.split('-')[1] || null;

                dateFrom = await moment(dateFrom,'MM/DD/YYYY').startOf('day');
                dateTo = await moment(dateTo,'MM/DD/YYYY').endOf('day');
                // DATE RANGE

                console.log('called date range');

                purchaseOrders = await PurchaseOrder.find({
                    [option]:{
                        $gte: dateFrom,
                        $lte: dateTo
                    }
                });
            
            }else{

                // SINGLE DATE
                const value1 = await moment(value,'MM/DD/YYYY').startOf('day');
                const value2 = await moment(value,'MM/DD/YYYY').endOf('day');
                
                purchaseOrders = await PurchaseOrder.find({
                    [option]:{
                        $gte: value1,
                        $lte: value2
                    }
                });
            }
        }
        else if(option === 'buyer'){

            console.log(`${option} => ${value} BUYER ARRAY`);

            // ARRAY
            purchaseOrders = await PurchaseOrder.find({
                'buyer.buyer' :{ $in : value.toUpperCase().split(',')  }
            });
        }else if(option === 'status'){
            console.log(`${option} => ${value} STATUS ARRAY`);
            // ARRAY
            purchaseOrders = await PurchaseOrder.find({
                'status.status' :{ $in : value.toUpperCase().split(',')  }
            });
        }
        else if(option === 'reqAttDepts'){
            console.log(`${option} => ${value} REQATTDEPTS ARRAY`);
            // ARRAY
            purchaseOrders = await PurchaseOrder.find({
                'reqAttDepts.department' :{ $in : value.toUpperCase().split(',')  }
            });
        }
        else{
            console.log(`${option} => ${value} STRING PO ARRAY`);
            // STRING
            purchaseOrders = await PurchaseOrder.find({[option]:{ $regex: value}});

            //{name: new RegExp('^'+name+'$', "i")}
        }   
        
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

    res.json(updatedPurchaseOrder);
}
