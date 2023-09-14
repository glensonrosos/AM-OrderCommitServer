import PurchaseOrder from "../models/purchaseOrder.js";
import mongoose from "mongoose";
import moment from 'moment';

export const getPurchaseOrders = async (req,res)=>{
    const {page} = req.query;
    try{

        const LIMIT = 5 ;
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

export const getCountPurchaseOrdersByDepartment = async (req,res)=>{
    try{

             //   {"_id":"64c76507789aa6953ef3d741","department":"PD"},
            //   {"_id":"64c76507789aa6953ef3d744","department":"QA"},
            //   {"_id":"64c764df789aa6953ef3d740","department":"AM"},
            //   {"_id":"64c76507789aa6953ef3d742","department":"PURCHASING"},
            //   {"_id":"64c76507789aa6953ef3d743","department":"PRODUCTION"},
            //   {"_id":"64c76507789aa6953ef3d745","department":"LOGISTICS"}

        const AM = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'AM'}
        }).
        countDocuments({});

        const PD = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'PD'}
        }).
        countDocuments({});

        const PU = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'PURCHASING'}
        }).
        countDocuments({});

        const PROD = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'PRODUCTION'}
        }).
        countDocuments({});

        const QA = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'QA'}
        }).
        countDocuments({});

        const LOGS = await PurchaseOrder.find({
            'status.status': {$eq:'OPEN'},
            'reqAttDepts.department':{$eq:'LOGISTICS'}
        }).
        countDocuments({});


        res.status(200).json({AM,PD,PU,PROD,QA,LOGS});
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

// Query =>    /posts?page=1    page=1
// Params =>    /post/123sfs    id=123sfs

export const getPurchaseOrdersBySearch = async (req,res)=>{
    try{
        const {option,value,page} = req.query;

        let purchaseOrders = [];

        const LIMIT = 5 ;
        //get the starting index of evert page;

        const startIndex = ( Number(page)-1 ) * LIMIT;

        let total = null;

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

                total = await PurchaseOrder.find({
                    [option]:{
                        $gte: dateFrom,
                        $lte: dateTo
                    }
                }).countDocuments({});


                purchaseOrders = await PurchaseOrder.find({
                    [option]:{
                        $gte: dateFrom,
                        $lte: dateTo
                    }
                }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);
            
            }else{

                // SINGLE DATE
                const value1 = await moment(value,'MM/DD/YYYY').startOf('day');
                const value2 = await moment(value,'MM/DD/YYYY').endOf('day');

                total = await PurchaseOrder.find({
                    [option]:{
                        $gte: value1,
                        $lte: value2
                    }
                }).countDocuments({});
                
                purchaseOrders = await PurchaseOrder.find({
                    [option]:{
                        $gte: value1,
                        $lte: value2
                    }
                }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);
            }
        }
        else if(option === 'reqAttDepts'){
            console.log(`${option} => ${value} REQATTDEPTS ARRAY`);
            // ARRAY
            total = await PurchaseOrder.find({
                'reqAttDepts.department' :{ $in : value.toUpperCase().split(',')  }
            }).countDocuments({});

            purchaseOrders = await PurchaseOrder.find({
                'reqAttDepts.department' :{ $in : value.toUpperCase().split(',')  }
            }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);
        }
        else if(option === 'buyer'){

            console.log(`${option} => ${value} BUYER ARRAY`);

            total = await PurchaseOrder.find({
                'buyer.buyer' :{$regex: '.*' + value + '.*', $options: 'i'}
            }).countDocuments({});

            // ARRAY
            purchaseOrders = await PurchaseOrder.find({
                'buyer.buyer' :{$regex: '.*' + value + '.*', $options: 'i'}
            }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);


        }else if(option === 'status'){
            console.log(`${option} => ${value} STATUS ARRAY`);
            // ARRAY
            total = await PurchaseOrder.find({
                'status.status' :{$regex: '.*' + value + '.*', $options: 'i'}
            }).countDocuments({});

            purchaseOrders = await PurchaseOrder.find({
                'status.status' :{$regex: '.*' + value + '.*', $options: 'i'}
            }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);
        }
        
        else{
            console.log(`${option} => ${value} STRING PO ARRAY`);
            // STRING
            total = await PurchaseOrder.find({[option]:{ $regex: '.*' + value + '.*', $options: 'i'}}).countDocuments({});

            purchaseOrders = await PurchaseOrder.find({[option]:{ $regex: '.*' + value + '.*', $options: 'i'}})
                .sort({ _id: -1}).limit(LIMIT).skip(startIndex);

            //{name: new RegExp('^'+name+'$', "i")}
        }   
        
       // res.status(200).json(purchaseOrders); 

        res.status(200).json({purchaseOrders, 
            currentPage:(Number(page)), numberOfPages:Math.ceil(total/ LIMIT) });

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
        reqAttDepts:[{_id:"64c764df789aa6953ef3d740",department:"AM"}],
        status:{
            _id:"64cb742f6dec3a86e635ce26",
            status:"OPEN",
            color:"error",
            code:0
        },
        remarks:null,
        amCom:{
            editedBy:null,
            updatedAt:null
        },
        pdCom:{
            status:"open",
            finish:null,
            editedBy:null,
            updatedAt:null
        },
        puCom:{
            status:"open",
            finish:null,
            editedBy:null,
            updatedAt:null
        },
        prodCom:{
            status:"open",
            finish:null,
            editedBy:null,
            updatedAt:null
        },
        qaCom:{
            status:"open",
            finish:null,
            editedBy:null,
            updatedAt:null
        },  
        logCom:{
            status:"open",
            finish:null,
            editedBy:null,
            requiredShipDate:poDetails.shipDate,
            requestedShipDate:null,
            updatedAt:null
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
    const {dateIssued,buyer,poNumber,shipDate,status,reqAttDepts,remarks,editedBy} = req.body;
    const updatedAt = new Date().toISOString();

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');

    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,{dateIssued,buyer,poNumber,shipDate,status,reqAttDepts,
            remarks,editedBy,updatedAt,'logCom.requiredShipDate':shipDate,_id},{new:true});

    res.json(updatedPurchaseOrder);
}

export const updatePurchaseOrderByAuto = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {status,reqAttDepts,remarks} = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');

    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,{status,reqAttDepts,remarks,_id},{new:true});

    res.json(updatedPurchaseOrder);
}

export const updatePurchaseOrderCellEditedBy = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {edit} = req.body;

    const updatedAt = new Date().toISOString();

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');

    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,edit,{new:true});

    console.log(edit);

    res.json(updatedPurchaseOrder);
}

export const updatePurchaseOrderByLogistics = async (req,res) =>{
    
    const { id:_id } = req.params;
    const {logRequiredShipDate, logRequestedShipDate, editedBy} = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('no purchase order with that id');
    
    const updatedPurchaseOrder = await PurchaseOrder.
        findByIdAndUpdate(_id,{
            logCom:{
                requiredShipDate: logRequiredShipDate,
                requestedShipDate: logRequestedShipDate,
                editedBy,
                updatedAt: new Date().toISOString()
            },_id},{new:true});

    res.json(updatedPurchaseOrder);
}
