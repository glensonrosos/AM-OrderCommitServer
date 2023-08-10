import Status from "../models/status.js";

export const getStatus = async (req,res)=>{
    try{
        const status = await Status.find();
        res.status(200).json(status);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

