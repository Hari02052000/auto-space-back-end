import { Router } from 'express'
import userHelpers from "../helpers/multer"

import authController  from '../controllers/user/authController'
import authHelper from '../helpers/isAuth'
import userController from '../controllers/user/userController'
import user from '../models/userSchema'
const router = Router()




router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/verify-otp',authController.verifyOtp)
router.post('/verify-email',authController.verifyEmail)
router.post('/upload-profile',authHelper.isAuth,userHelpers.uploadFiles,userController.uploadProfile)
router.post('/change-password',authController.changepassword)
router.get('/profile',authHelper.isAuth,userController.getprofile);
router.post('/edit-details',authHelper.isAuth,userController.editDetails)
router.get('/get-messages',authHelper.isAuth,userController.getMessages)





export default router