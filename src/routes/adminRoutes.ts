import { Router } from 'express'
import adminAuthController from '../controllers/admin/adminAuthController'

const router = Router()

router.post('/login',adminAuthController.login)
router.post('/verify-email',adminAuthController.verifyEmail)
router.post('/change-password',adminAuthController.changepassword)







export default router