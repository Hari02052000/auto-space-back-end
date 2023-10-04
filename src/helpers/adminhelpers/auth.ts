import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import adminSchema from "../../models/adminSchema"







function isAdmin(req: Request, res: Response, next: NextFunction) {
    let user = undefined
    const headers = req.headers.admintoken

    console.log(headers)
    if (typeof headers === 'string') {

        const token = headers.split(' ')[1]

        if (token) {

            jwt.verify(token, 'key2', async (err, decoded) => {
                if (err) {

                    res.json({ err: err })

                }
                else if (decoded) {

                    const decodedPayload = decoded as jwt.JwtPayload;


                    user = await adminSchema.findOne({ _id: decodedPayload.id })

 
                    console.log('next')

                    next()
                }
            })

        }
        else {
            res.json({ err: 'token not found' })
        }
    }

}



export default { isAdmin }