import { Router } from 'express'
import authController  from '../controllers/user/authController'
import authHelper from '../helpers/isAuth'

const router = Router()




router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/verify-otp',authController.verifyOtp)
router.post('/verify-email',authController.verifyEmail)
//here cheak using the changepassword token valid or not
router.post('/change-password',authHelper.changePasswordToken,authController.changepassword)





export default router