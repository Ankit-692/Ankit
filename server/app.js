import express from "express";
import { Server } from "socket.io";
import http from 'http';
import cors from 'cors';

const app = express()
let users = []
app.use(cors({
    origin: '*',
    preflightContinue: true,
  }));

const server = http.createServer(app)
const io = new Server(server)

const port = process.env.port || 3000
let rooms = []
let fullroom = false


app.use("/",(req,res)=>{
    res.send(`Server is running on Port ${port}`)
})


io.on('connection',(socket)=>{

    fullroom = false

    console.log("new Connection!")

    socket.on('join',(roomId)=>{
        users = socket.adapter.rooms.get(roomId);
        if(!users){
            socket.join(roomId)
            rooms.push(roomId)
            socket.emit('getrooms',rooms)
            socket.emit('startNew')
        }
        else{
            let userArray = [...users]
            if(userArray.length == 1){
                socket.join(roomId)
                const index = rooms.indexOf(roomId)
                rooms.splice(index,1)
                socket.emit('getrooms',rooms)
                socket.emit('startNew')
            }
            else if(userArray.length == 2){
                socket.emit('roomFull')
                fullroom = true
            }         
            }
        })
    
    socket.on('newGame',(roomId)=>{
        users = socket.adapter.rooms.get(roomId);
        if(users){
            let userArray = [...users]
            if(userArray.length == 2 && !fullroom){
                const randomChoice = Math.round(Math.random())
                io.to(roomId).emit('start',userArray[randomChoice])
            }
        }
    })

    socket.on('clicked',({board,roomId})=>{
        fullroom = false
        socket.to(roomId).emit('updateBoard',board)
    })

    socket.on('finishGame',(roomId)=>{
        socket.to(roomId).emit('youLose')
    })

    socket.on('search',()=>{
        socket.emit('getRooms',rooms)
    })

    socket.on('leaveRoom',(roomId)=>{
        socket.leave(roomId);
        users = socket.adapter.rooms.get(roomId);
        if(users){
         let userArray = [...users]
         if(userArray.length == 1 && !rooms.includes(roomId)){
            rooms.push(roomId)
            io.to(roomId).emit('userLeft')
        }
        }
        else{
            const index = rooms.indexOf(roomId)
            rooms.splice(index,1)
        }
    
    socket.emit('getrooms',rooms)
    })

    socket.on('draw',(roomId)=>{
        io.to(roomId).emit('noWinner')
    })

})


server.listen(port,()=>{
    console.log(`server started at ${port}`)
})