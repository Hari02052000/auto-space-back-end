import { Router } from 'express'


import brandController  from "../controllers/admin/brandController"

import helpers from '../helpers/adminhelpers/auth'


const router = Router()


router.get('/get-brands',helpers.isAdmin,brandController.getBrands)


router.post('/add-brand',helpers.isAdmin,brandController.createBrand)
router.post('/edit-brand',helpers.isAdmin,brandController.editBrand)
router.post('/edit-model',helpers.isAdmin,brandController.editmodel)
router.post('/edit-option',helpers.isAdmin,brandController.editoption)

router.post('/add-model',helpers.isAdmin,brandController.addModel)
router.post('/add-option',helpers.isAdmin,brandController.addOption)







export default router