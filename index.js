import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import purchaseOrderRoutes from './routes/purchaseOrder.js';

const app = express();

// http://localhost:5000/purchaseOrder/

app.use(bodyParser.json({limit:"30mb",extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());


const PORT = process.env.PORT || 5000;
const CONNECTION_URL = "mongodb://glenson21:glenson21123@localhost:27017/ordercommitment"


mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=> app.listen(PORT,() => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

app.use('/purchaseOrder',purchaseOrderRoutes);