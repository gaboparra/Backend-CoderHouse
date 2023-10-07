import { promises as fs, readFile } from "fs"

class ProductManager {
    constructor() {
        this.path = "./products.txt";
        this.products = []
    }

    static id = 0

    addProduct = async (title, description, price, thumbnail, code, stock) => {

        ProductManager.id++
        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ProductManager.id
        };
        this.products.push(newProduct)

        await fs.writeFile(this.path, JSON.stringify(this.products))
    };

    readProducts = async () => {
        let response = await fs.readFile(this.path, "utf-8")
        return JSON.parse(response)
    }

    getProducts = async () => {
        let response2 = await this.readProducts()
        return console.log(response2)
    }

    getProductById = async (id) => {
        let response3 = await this.readProducts()
        if (!response3.find(product => product.id === id)) {
            console.log("Not found");
        } else {
            console.log(response3.find(product => product.id === id));
        }
    }

    deleteProductById = async (id) => {
        let response3 = await this.readProducts();
        let productFilter = response3.filter(products => products.id != id)
        await fs.writeFile(this.path, JSON.stringify(productFilter));
        console.log("Removed product");
    };

    updateProduct = async ({ id, ...product }) => {
        await this.deleteProductById(id)
        let oldProduct = await this.readProducts()
        let modifiedProduct = [{ ...product, id }, ...oldProduct];
        await fs.writeFile(this.path, JSON.stringify(modifiedProduct))
    }
}

const products = new ProductManager

//products.addProduct("title2", "description2", 2500, "img2", "002", 15)
//products.addProduct("title1", "description1", 2000, "img1", "001", 10)
//products.addProduct("title3", "description3", 3000, "img3", "003", 5)

//products.getProducts()

//products.getProductById(3)

//products.deleteProductById(2)

products.updateProduct({
    title: 'title3',
    description: 'description3',
    price: 4500,
    thumbnail: 'img3',
    code: '003',
    stock: 5,
    id: 3
})