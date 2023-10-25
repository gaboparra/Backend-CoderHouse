/*class ProductManager {
    constructor() {
        this.products = []
    }

    static id = 0

    addProduct(title, description, price, thumbnail, code, stock) {

        if (this.products.some(product => product.code === code)) return 'El código ya existe, intente con otro.'
        if (!title || !description || !price || !thumbnail || !stock) return 'Faltan campos a completar'

        ProductManager.id++
        this.products.push({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ProductManager.id
        })
    }
    getProduct() {
        return this.products;
    }

    getProductById(id) {
        if (!this.products.find((product) => product.id === id)) {
            console.log('No encontrado');
        } else {
            console.log(this.products.find((product) => product.id === id));
        }
    }}

const products = new ProductManager();

products.addProduct('title1', 'description1', 2000, 'img1', '001', 10)
products.addProduct('title2', 'description2', 2500, 'img2', '002', 15)

console.log(products.getProduct());

(products.getProductById(1));*/

