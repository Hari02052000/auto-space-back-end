import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import  logger from 'morgan'

import http from 'http'; 

 dotenv.config()


import { Server as SocketIOServer} from 'socket.io'; 


import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'

import usersProductRoutes from './routes/userProductRoutes'
import adminProductRoutes from './routes/adminProductRoutes'
import adminUserRoutes from './routes/adminUserRoutes'
import adminBrandRoutes from './routes/adminBrandRoutes'
import chatRoute from './routes/userChatRoute'
import subscriptionRoutes from './routes/userSubscriptionRoutes'
import planRoutes from './routes/adminPlanRoutes'
import socketHandelers from './sockets/socketManeger'


import  './connection/mongooseConnection'






const app = express()

app.use(cors({ origin: '*' }))


const server = http.createServer(app); 
const io = new SocketIOServer(server)






app.use(logger('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

socketHandelers.socketHandilers(io)
app.use('/product',usersProductRoutes)

app.use('/user/products',usersProductRoutes)
app.use('/user/chat', chatRoute);
app.use('/user/subscription',subscriptionRoutes)
app.use('/user',userRoutes)

app.use('/admin/products',adminProductRoutes)
app.use('/admin/users',adminUserRoutes)
app.use('/admin/brand',adminBrandRoutes)
app.use('/admin/model',adminBrandRoutes)
app.use('/admin/option',adminBrandRoutes)
app.use('/admin/plans',planRoutes)

app.use('/admin',adminRoutes)




server.listen(process.env.PORT,()=>console.log('server started...',process.env.PORT))