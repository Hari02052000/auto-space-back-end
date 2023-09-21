import jwt from 'jsonwebtoken'
import userModel from "../../models/userSchema"



async function tokenValidate(token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.verify(token, 'key1', async (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
            } else if (decoded) {
                const decodedPayload = decoded as jwt.JwtPayload;
                const user = await userModel.findOne({ _id: decodedPayload.id });

                if (user) {
                    if(user.isBlocked){
                       
                        resolve('noUser');

                    }
                    resolve(user._id.toString());
                } else {
                    resolve('noUser');
                }
            }
        });
    });
}



export default { tokenValidate }