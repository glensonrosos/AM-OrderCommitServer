import express from 'express';

import { getPurchaseOrders,getPurchaseOrder,getPurchaseOrdersBySearch,createPurchaseOrder,
    updatePurchaseOrderByAM,updatePurchaseOrderByLogistics,
    updatePurchaseOrderCellEditedBy,updatePurchaseOrderByAuto,
    getCountPurchaseOrdersByDepartment} from '../controllers/purchaseOrder.js'

const router = express.Router();

router.get('/search',getPurchaseOrdersBySearch);
router.get('/',getPurchaseOrders);
router.get('/getReqAttDepts',getCountPurchaseOrdersByDepartment)
router.post('/',createPurchaseOrder);
router.get('/:id',getPurchaseOrder);
router.patch('/:id/AM',updatePurchaseOrderByAM);
router.patch('/:id/Auto',updatePurchaseOrderByAuto);
router.patch('/:id/CellEditedBy',updatePurchaseOrderCellEditedBy)
router.patch('/:id/Logistics',updatePurchaseOrderByLogistics);


export default router;