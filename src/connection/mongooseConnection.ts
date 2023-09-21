import mongoose from "mongoose";

if (process.env.db_connection) {

    mongoose.connect(process.env.db_connection)
    mongoose.connection.on('err', error => console.log(error))
    mongoose.connection.once('open', () => console.log('connected to db'))


}

else {
    console.log(process.env.db_connection)
}

