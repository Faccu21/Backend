
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require ("./routes/products.router");
const cartsRouter = require ("./routes/carts.router.js");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});






