const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const router = require("./routes/index");

// Servidor http
const http = require("http");
const server = http.createServer(app);

// Statics
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/api", router);

// Socket Server
const {Server} = require("socket.io");
const io = new Server(server);

const msn = [
    {
        nombre: "Carlos",
        msn:"hola!"
    },
    {
        nombre: "Lio",
        msn:"hola!"
    }
]

io.on("connection", (socket) => {
    console.log("usuario conectado");
    socket.emit("message_back", msn);
    socket.on("message_client", (data) =>{
        console.log(data);
    })
    socket.on("data_client", (data) =>{
        console.log(data);
        msn.push(data);
        console.log(msn);
        io.sockets.emit("message_back", msn);
    })
});


server.listen(PORT, () =>{
    console.log("server running on port 8080");
});