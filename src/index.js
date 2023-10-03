class ProductManager {

    constructor() {
        this.products = []
    }

    static id = 0

    addProduct = ({ title, description, code, price, thumbnail, stock }) => {

        if (this.products.some(product => product.code === code)) return 'El código ya existe, intente con otro.'
        if (!title || !description || !price || !thumbnail || !stock) return 'Faltan campos a completar'
        ProductManager.id++
        this.products.push({
            title,
            description,
            code,
            price,
            thumbnail,
            stock, 
            id: ProductManager.id
        })
    }

    getProductById = (id) => {
       if(!this.products.find((product) => product.id === id)){
        console.log('No encontrado');
       }
       else{
        console.log(this.products.find((product) => product.id === id));
       }

       // if (product) return product
       // else console.error('No encontrado')
    }
}

const productManager = new ProductManager()

const productToAdd = {
    title: "Mangas",
    description: "",
    code: "001",
    price: 2000,
    thumbnail: 'img1',
    stock: 10
}

productManager.addProduct(productToAdd)

productManager.addProduct({
    title: "Comics",
    description: "",
    code: "002",
    price: 2500,
    thumbnail:'img2',
    stock: 15
})


console.log(productManager);

