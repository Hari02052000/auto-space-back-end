import jwt from 'jsonwebtoken'
import userModel from "../../models/userSchema"

async function tokenValidate(token:string):Promise<string|void>{

    const decoded = jwt.verify(token, 'key1') as jwt.JwtPayload;


    const user = await userModel.findOne({ _id: decoded.id });

    if (user) {
        return (user._id).toString();                            
}
else {
    return 'noUser'
}
}


export default {tokenValidate}