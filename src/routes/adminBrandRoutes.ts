import { Router } from 'express'


import brandController  from "../controllers/admin/brandController"

const router = Router()


router.get('/get-brands',brandController.getBrands)


router.post('/add-brand',brandController.createBrand)
router.post('/edit-brand',brandController.editBrand)
router.post('/add-model',brandController.addModel)
router.post('/add-option',brandController.addOption)







export default router