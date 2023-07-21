import express from 'express';

import { getPurchaseOrders, createPurchaseOrder} from '../controllers/purchaseOrder.js'

const router = express.Router();

router.get('/',getPurchaseOrders);
router.post('/',createPurchaseOrder);

export default router;