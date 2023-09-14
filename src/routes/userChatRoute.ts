import { Router } from 'express'
import userChatController from '../controllers/user/userChatController'
import AuthHelpers from '../helpers/isAuth'

const router = Router();

  
 router.get('/get-chat',AuthHelpers.isAuth,userChatController.getChats);
 
 router.post('/create-chat',AuthHelpers.isAuth,userChatController.createChat);





  export default router