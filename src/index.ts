import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import  logger from 'morgan'

import http from 'http'; 

import { Server as SocketIOServer} from 'socket.io'; 


import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'

import usersProductRoutes from './routes/userProductRoutes'
import adminProductRoutes from './routes/adminProductRoutes'
import adminUserRoutes from './routes/adminUserRoutes'
import adminBrandRoutes from './routes/adminBrandRoutes'
import chatRoute from './routes/userChatRoute'
import socketHandelers from './sockets/socketManeger'
import alertsHandelers from './sockets/allerts'


import  './connection/mongooseConnection'



dotenv.config()



const app = express()

const server = http.createServer(app); 
const io = new SocketIOServer(server)





app.use(cors({ origin: '*' }))

app.use(logger('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

socketHandelers.socketHandilers(io)
app.use('/product',usersProductRoutes)

app.use('/user/products',usersProductRoutes)
app.use('/user/chat', chatRoute);
app.use('/user',userRoutes)

app.use('/admin/products',adminProductRoutes)
app.use('/admin/users',adminUserRoutes)
app.use('/admin/brand',adminBrandRoutes)
app.use('/admin/model',adminBrandRoutes)
app.use('/admin/option',adminBrandRoutes)
app.use('/admin',adminRoutes)




server.listen(process.env.port,()=>console.log('server started...'))