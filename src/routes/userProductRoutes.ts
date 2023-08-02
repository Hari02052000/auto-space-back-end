import { Router } from 'express'
import userProductController from '../controllers/user/userProductController'
import userHelpers from "../helpers/multer"
import authHelper from '../helpers/isAuth'


const router = Router()


router.get('/get-products',authHelper.isBlocked,userProductController.getProducts)
router.get('/get-brands',authHelper.isBlocked,userProductController.getBrands)
router.post('/add-product',authHelper.isAuth,userHelpers.uploadFiles,userProductController.addProduct)
//router.post('/get-products',userProductController.getProducts)




export default router