const socket = io();

socket.on("products", (products) => {
  let productsList = document.getElementById("productList");

  productsList.innerHTML = "";
  products.forEach((product) => {
    productsList.innerHTML += `
    <div class="col-md-3 mb-5">
    <div class="card" style="width: 18rem;">
      <img src="" class="card-img-top" alt="${product.title}"/>
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-description">${product.description}</p>
        <p class="card-price">Precio: ${product.price}</p>
        <p class="card-stock">Stock: ${product.stock}</p>
        <button type="button" class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </div>
  </div>`;
  });
});

let addProduct = document.getElementById("submit");
addProduct.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnailInput").value;
  const stock = document.getElementById("stock").value;

  const product = {
    title,
    description,
    price,
    thumbnail,
    stock,
  };

  socket.emit("addProduct", product);
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
