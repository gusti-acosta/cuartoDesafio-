const { Router } = require("express");
const router = Router();
const  productManager = require("../productManager.js");

const manager = new productManager(__dirname+'/../products.json')


router.get('/', async (req, res) => {
    try {
        const products = await manager.getProduct();
        res.render('home', { products }); // Pasar los datos de los productos a la plantilla
    } catch (error) {
        console.log("Error getting products: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/realtimeproducts',async (req, res) => {
    const products = await manager.getProduct();
    res.render('realTimeProducts', {products})
    
})

module.exports = router;
