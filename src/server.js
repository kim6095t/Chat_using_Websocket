import http from "http";
import WebSocket from "ws";
import express from "express";

const app=express();

app.set("view engine","pug")
app.set("views",__dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res)=> res.render("home"))

const handleListen=()=> console.log('Listening on http://localhost:3000')

const server=http.createServer(app);
const wss=new WebSocket.Server({server})

const sockets=[]

wss.on("connection", (socket)=>{
    sockets.push(socket)
    socket["nickname"]="Anon"
    console.log("Connected to Brower")
    socket.on("close", ()=>console.log("Disconnect from the Brower"))
    socket.on("message", (msg)=>{
        //socket.send(message.toString()) //자기자신에게 호출
        const message=JSON.parse(msg)
        switch (message.type){
            case "new_message" :
                sockets.forEach(aSocket=>aSocket.send(`${socket.nickname} : ${message.payload}`))     //연결된 모든 브라우져 호출
                break
            case "nickname":
                socket["nickname"]=message.payload
        }
    })
    //socket.send("hello!!!!")
})

server.listen(3000, handleListen)


