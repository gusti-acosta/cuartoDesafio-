const fs = require('fs');

class CartManager {
    static id = 0;

    constructor() {
        this.path = "./src/cart.json";
        this.carts = [];
    };

    getCarts = async () => {
        const response = await fs.promises.readFile(this.path, 'utf8');
        const responseJSON = JSON.parse(response);
        return responseJSON;
    }

    getCartById = async (cid) => {
        const carts = await this.getCarts();
        const cartId = parseInt(cid); 
        const cart = carts.find((cart) => cart.id === cartId);
        if (cart) {
            return cart.products;
        } else {
            console.log('Carrito no encontrado');
            return null; // Devolver null para indicar que el carrito no se encontró
        }
    }

    newCart = async () => {
        this.carts = await this.getCarts();
        const highestId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
        const newId = highestId + 1;
        const newCart = {
            id: newId,
            products: [],
        };
        this.carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        return newCart;
    }

    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts();
        const index = carts.findIndex((cart) => cart.id === cartId);
        if (index !== -1) {        
            const cartProducts = await this.getCartById(cartId);
            const existingProductIndex = cartProducts.findIndex(p => p.productId === productId);
            if (existingProductIndex !== -1) {
                cartProducts[existingProductIndex].quantity += 1;
            } else {
                cartProducts.push({ productId, quantity: 1 });
            }
            carts[index].products = cartProducts;
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return { message: 'Se agregó el producto al carro' };
        } else {
            console.log("No se encontró el carrito");    
        }    
    }   
}

module.exports = CartManager ;