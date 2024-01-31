
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require ("./routes/products.router");
const cartsRouter = require ("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const viewsRouter = require("./routes/views.router");
const app = express();
const PORT = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api", productsRouter);
app.use("/api", cartsRouter);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("./src/public"));
app.use("/", viewsRouter);

io.on('connection', (socket) => {
  console.log('Usuario conectado');
});

http.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
