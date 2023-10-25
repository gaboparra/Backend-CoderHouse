import express from "express"
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/cart.routes.js"

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/products", ProductRouter)
app.use("/carts", CartRouter)


app.listen(PORT, () => console.log(`Local Host ${PORT}`))