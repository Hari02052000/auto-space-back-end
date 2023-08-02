import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import  logger from 'morgan'

import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import usersProductRoutes from './routes/userProductRoutes'
import adminProductRoutes from './routes/adminProductRoutes'
import adminUserRoutes from './routes/adminUserRoutes'
import adminBrandRoutes from './routes/adminBrandRoutes'

import  './connection/mongooseConnection'

dotenv.config({path:'./.env'})



const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/product',usersProductRoutes)

app.use('/user/products',usersProductRoutes)
app.use('/user',userRoutes)

app.use('/admin/products',adminProductRoutes)
app.use('/admin/users',adminUserRoutes)
app.use('/admin/brand',adminBrandRoutes)
app.use('/admin/model',adminBrandRoutes)
app.use('/admin/option',adminBrandRoutes)
app.use('/admin',adminRoutes)

app.listen(3000,()=>console.log('server started...'))