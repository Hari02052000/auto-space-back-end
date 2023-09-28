import { Router } from 'express'


import brandController  from "../controllers/admin/adminPlanController"


const router = Router()

router.get('/get-plans',brandController.getPlans)



export default router