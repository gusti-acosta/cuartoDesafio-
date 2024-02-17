const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
    static id = 0;

    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const maxId = Math.max(...this.products.map(product => product.id));
                ProductManager.id = maxId;
            }
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
        }
    }

    addProduct({ title, description, price, thumbnail = 'https://w7.pngwing.com/pngs/700/376/png-transparent-computer-icons-no-symbol-no-entry-sign-angle-triangle-sign.png', code = uuidv4(), stock = 1, status = true, category, id }) {
        const productExists = this.products.some(product => product.id === id);
        if (productExists) {
            console.log('Este producto ya existe...');
            return;
        } else {
            ProductManager.id++;
            const newProduct = {
                id: ProductManager.id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: status,
                category: category
            };

            this.products.push(newProduct);
            this.saveProducts();
        }
    }

    getProducts(limit) {
        if (limit === undefined) {
            return this.products;
        } else {
            return this.products.slice(0, parseInt(limit));
        }
    }

    async getProduct(){
        const content = await fs.promises.readFile(this.path, 'utf-8');
        const product = JSON.parse(content);
        return product;
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id == id);
        if (product !== undefined) {
            return product;
        } else {
            console.log('Producto no encontrado.');
            return null;
        }
    }

    updateProduct(id, newData) {
        const productIndex = this.products.findIndex(p => p.id == id);

        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...newData };
            this.products[productIndex] = updatedProduct;
            this.saveProducts();
            return updatedProduct;
        } else {
            console.log('Producto no encontrado.');
            return null;
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
            console.log('Producto eliminado correctamente.');
        } else {
            console.log('Producto no encontrado o ya fue eliminado.');
        }
    }
}

module.exports = ProductManager;





