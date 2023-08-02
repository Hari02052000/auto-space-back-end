import { Router } from 'express'

import adminUserControlers from "../controllers/admin/userControllers"

const router = Router()


router.get('/get-users',adminUserControlers.findUsers)


router.put('/block-user',adminUserControlers.blockUser)
router.put('/unblock-user',adminUserControlers.unBlockUser)



export default router