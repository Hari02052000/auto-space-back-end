import { Server as SocketIOServer } from 'socket.io';

function alertHandeler(io:SocketIOServer){

    const alerts = io.of('/user-chat')


}


export default {alertHandeler}