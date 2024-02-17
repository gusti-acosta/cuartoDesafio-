const { Router } = require("express");
const  cartManager = require("../app.js");

const cartsRouter = Router();
// Corregir la importación y la creación de la instancia de CartManager
cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los carritos.');
    }
});
cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) { // Capturar el error para manejarlo adecuadamente
        console.error(error);
        res.status(500).send('Server error.');
    }
});

cartsRouter.get('/:id', async (req, res) => {
    const id = req.params.id; // Obtener el valor del parámetro ID
    try {
        const response = await cartManager.getCartById(id); // Corregir el nombre del método
        res.json(response);
    } catch (error) { // Capturar el error para manejarlo adecuadamente
        console.error(error);
        res.status(500).send('Error al intentar enviar los productos al carrito.');
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.send('Producto agregado correctamente.');
    } catch (error) { // Capturar el error para manejarlo adecuadamente
        console.error(error);
        res.status(500).send('Error al intentar guardar producto en el carrito.');
    }
});

module.exports = cartsRouter;
