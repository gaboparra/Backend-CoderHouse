class ProductManager {

    constructor() {
        this.products = []
    }

    addProduct = ({ title, description, code }) => {

        if (this.products.some(product => product.code === code)) return
        if (!title || !description) return

        this.products.push({
            title,
            description,
            code
        })
    }

    getProductById = (code) => {
        const product = this.products.find(p => p.code === code)

        if (product) return product
        else console.error('No encontrado')
    }
}

const productManager = new ProductManager()

const productToAdd = {
    title: "Mangas",
    description: "",
    code: "001"
}

productManager.addProduct(productToAdd)

productManager.addProduct({
    title: "Comics",
    description: "",
    code: "002"
})

console.log(productManager);

