import { Router } from 'express'

import adminUserControlers from "../controllers/admin/userControllers"
import helpers from '../helpers/adminhelpers/auth'


const router = Router()


router.get('/get-users',helpers.isAdmin,adminUserControlers.findUsers)


router.put('/block-user',helpers.isAdmin,adminUserControlers.blockUser)
router.put('/unblock-user',helpers.isAdmin,adminUserControlers.unBlockUser)



export default router