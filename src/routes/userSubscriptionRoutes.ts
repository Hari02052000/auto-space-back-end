import { Router } from 'express'
import AuthHelpers from '../helpers/isAuth'
import userSubscriptionController from '../controllers/user/userSubscriptionController'

const router = Router();

router.get('/get-plans',AuthHelpers.isBlocked,userSubscriptionController.getPlans)
router.post('/create-payment',AuthHelpers.isAuth,userSubscriptionController.createPayment)





export default router