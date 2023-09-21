import { Router } from 'express'
import productController from '../controllers/admin/productController'

const router = Router()

router.get('/get-product',productController.getProducts)

router.put('/list-product',productController.listProduct)
router.put('/unlist-product',productController.unlistProduct)






export default router