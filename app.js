const express = require('express')
const {createServer} = require('http')
const app = express()
const {Server} = require('socket.io')
const path = require('path')

const server = createServer(app);
const io = new Server(server)

app.use(express.static('public'))

io.on('connection',(socket)=>{
    console.log("new device connected")
    socket.on('disconnect',()=>{
        console.log('user disconnect')
        io.emit('user-disconnected',socket.id)
    })

    socket.on('send-location',(data)=>{
        io.emit('update-location',{id:socket.id,...data})
    })
})
const port = 3000;
app.get('/',(req,res)=>{
    res.sendFile('index.html')
})

server.listen(port,()=>{
    console.log("app started listening at port ",port)
})