import { Router } from 'express'
import userProductController from '../controllers/user/userProductController'
import userHelpers from "../helpers/multer"
import authHelper from '../helpers/isAuth'
import productController from '../controllers/admin/productController'


const router = Router()
router.get('/get-products',authHelper.isBlocked,userProductController.getProducts)
router.get('/get-brands',authHelper.isBlocked,userProductController.getBrands)
router.get('/search-products',authHelper.isBlocked,userProductController.searchProduct)
router.post('/add-product',authHelper.isAuth,userHelpers.uploadFiles,userProductController.addProduct)
router.get('/single-product/:id',authHelper.isBlocked,userProductController.getsingleProduct)
router.get('/edit-product/:id',authHelper.isAuth,userProductController.getEditProduct)
router.get('/posted-products',authHelper.isAuth,userProductController.getPostedProducts)

router.post('/delete-image',authHelper.isAuth,userProductController.deleteimage)
router.post('/upload-new-images',authHelper.isAuth,userHelpers.uploadFiles,userProductController.uploadimages)
router.post('/update-product',authHelper.isAuth,userProductController.updateProduct)
router.post('/mark-sold',authHelper.isAuth,userProductController.markSold)

export default router