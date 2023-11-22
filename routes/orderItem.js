import express from 'express';
import {auth} from '../middleware/auth.js';

import {getOrderItem,createOrderItem,updateCellOrderItem,deleteOrderItem,getOrderItemForImage,updateCellOrderItemImage,getCountOrderItemStatusOpen,updateOrderItemInBulk,clearDateOrderItemInBulk} from '../controllers/orderItem.js'

const router = express.Router();

router.post('/',createOrderItem);
router.post('/updateOrderItemInBulk',updateOrderItemInBulk)
router.post('/clearDateOrderItemInBulk',clearDateOrderItemInBulk)
router.get('/:id',getOrderItem);
router.get('/:id/getCountOrderItemStatusOpen',getCountOrderItemStatusOpen);
router.get('/:id/image',getOrderItemForImage);
router.delete('/:id',deleteOrderItem);
router.patch('/:id/updateCell',updateCellOrderItem);
router.patch('/:id/updateCellImage',updateCellOrderItemImage);

export default router;