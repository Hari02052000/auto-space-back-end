import { Router } from 'express'
import productController from '../controllers/admin/productController'
import helpers from '../helpers/adminhelpers/auth'

const router = Router()

router.get('/get-product',helpers.isAdmin,productController.getProducts)

router.put('/list-product',helpers.isAdmin,productController.listProduct)
router.put('/unlist-product',helpers.isAdmin,productController.unlistProduct)






export default router