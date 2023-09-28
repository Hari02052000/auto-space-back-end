import { Router } from 'express'
import userChatController from '../controllers/user/userChatController'
import AuthHelpers from '../helpers/isAuth'

const router = Router();



  
 router.get('/get-chat',AuthHelpers.isAuth,userChatController.getChats);
 





  export default router