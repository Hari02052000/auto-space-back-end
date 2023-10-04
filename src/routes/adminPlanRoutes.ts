import { Router } from 'express'


import brandController  from "../controllers/admin/adminPlanController"
import helpers from '../helpers/adminhelpers/auth'



const router = Router()

router.get('/get-plans',helpers.isAdmin,brandController.getPlans)
router.post('/edit-plan',helpers.isAdmin,brandController.editplan)
router.post('/add-plan',helpers.isAdmin,brandController.addplan)
router.post('/get-subscription-details',helpers.isAdmin,brandController.getSubscriptionDetails)


export default router