const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;
const router = require("./routes/index");
const handlebars = require("express-handlebars");
const Contenedor = require('./EntregableAnterior');

const products = new Contenedor("products.txt");
const messages = new Contenedor("messages.txt");

// Servidor http
const http = require("http");
const server = http.createServer(app);

// Statics
app.use(express.static(__dirname + "/public"));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs"
    })
);

app.set("views", "./views");
app.set("view engine", "hbs");

// Routes
app.use("/api", router);

// Socket Server
const { Server } = require("socket.io");
const io = new Server(server);

const msn = [
]

const users = [
]

app.post("/productos", (req, res) => {
    console.log(req.body);
    products.save({ id: req.body.id, title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail });
    res.redirect('/productos')
});

app.get("/productos", async (req, res) => {
  res.render("products", { products: JSON.parse(await products.readAll()), title: "Vista de productos" });
});

app.get("/chat", async (req, res) => {
    res.render("chat", { chats: msn, title: "Vista de chats" });
});

io.on("connection", (socket) => {
    socket.emit("message_back", msn);
    
    socket.on("data_client", (data) => {
        msn.push(data);
        messages.save({ id: 0, date: data.time, user: data.nombre, message: data.msn });
        io.sockets.emit("message_back", msn);
        console.log(msn)
    })

    socket.on("Log_Connecte_Users", (data) => {
        users.push(data);
        console.log("usuarios conectados al chat");
        console.table(users);
    })
});

server.listen(PORT, () => {
    console.log("server running on port " + PORT);
});