import express from 'express';

import { getPurchaseOrders,getPurchaseOrder, createPurchaseOrder,updatePurchaseOrderByAM,updatePurchaseOrderByLogistics} from '../controllers/purchaseOrder.js'

const router = express.Router();

router.get('/',getPurchaseOrders);
router.post('/',createPurchaseOrder);
router.get('/:id',getPurchaseOrder);
router.patch('/:id/AM',updatePurchaseOrderByAM);
router.patch('/:id/Logistics',updatePurchaseOrderByLogistics);


export default router;