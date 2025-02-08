import express from "express";
import http from "http";
import { Server } from "socket.io";
import {engine} from "express-handlebars";
import viewRouter from "./routes/views.router.js";
import { Socket } from "dgram";

const app=express();
const server=http.createServer(app);//ESTO ES PARA QUE EL SERCIDOR sea compatible con socket.io
const port=8080;

const io=new Server(server);//creamo para poder utilizar la comunicacion entre cliente y servidor
app.use(express.static("public"));

//handlebars
app.engine("handlebars",engine());//le decimos a express que vamios a utilizar handlebars, es importar el motor de plantilla y lo ejecutmaos aca
app.set("view engine","handlebars");//
app.set("views","./src/views");//le decimos a expres donde estan las vistas


//endpoints
app.use("/",viewRouter);//conectamos el route con la app

const messages=[];
//websockets
io.on("connection",(socket)=>{
    console.log("nuevo usuario conectado");

socket.on("new user connected",(username)=>{
    //devolvemos el historial de mensajes solo al cliente que se conecto
    socket.emit("chat history",messages);

    //emitimos un evento de notificacion de conexion a todo menos al que se conecta
    socket.broadcast.emit("new user",username);
});

    socket.on("message",(data)=>{
        //console.log(data.username ,"-", data.message);
        messages.push(data);
          //trasmitimos el mensaje nuevo a todos los clientes conectados
        io.emit("broadcast new message",data);
    })

  
   
    
})
server.listen(port,()=>{
    console.log("servidor iniciado correctamente");
})