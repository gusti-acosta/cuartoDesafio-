const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const  productManager = require("./productManager.js");

const manager = new productManager(__dirname+'/products.json')

const CartManager = require('./cartManager.js'); // Cambio aquí

const  productsRouter  = require("./routes/products.router.js");
const cartsRouter  = require('./routes/carts.router.js');
const  viewsRouter  = require('./routes/views.router.js');

const PORT = 8080;

const app = express();


// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Configuración de Socket.io

// Instancias de los managers
const cartManager = new CartManager(); // Se utiliza la clase importada correctamente

// Middlewares
app.use(express.json());
app.use(express.static('public'));



// Inicio del servidor
const serverHttp = app.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
});

//socket.io
const  io = new Server(serverHttp)

io.on('connection', (socket)=>{
    console.log('socket connected')

    app.use((req, _res, next) => {
        req.io = io;
        next()
    })

    socket.on('new product', async (newProduct)=>{
        console.log('New product received:', newProduct);
        await manager.addProduct(newProduct);
        const products = await manager.getProduct();
        io.emit('list updated', {products});
        console.log('List of products updated:', products); 
    })
    
    socket.on('delete product',async ({id})=> {
        await manager.deleteProduct(id);
        const products = await manager.getProduct();
        io.emit('list updated', {products})
    })
})

//routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);