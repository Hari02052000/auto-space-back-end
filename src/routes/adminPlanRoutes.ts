import { Router } from 'express'


import brandController  from "../controllers/admin/adminPlanController"


const router = Router()

router.get('/get-plans',brandController.getPlans)
router.post('/edit-plan',brandController.editplan)
router.post('/add-plan',brandController.addplan)
router.post('/get-subscription-details',brandController.getSubscriptionDetails)


export default router