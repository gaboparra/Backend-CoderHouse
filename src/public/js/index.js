const socket = io();

socket.on("products", (products) => {
  let table = document.getElementById("products");

  table.innerHTML = "";
  products.forEach((product) => {
    table.innerHTML += `<tr>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
    </tr>`;
  });
});

//let inputAdd = document.getElementById("")
//let inputDelete = document.getElementById("")

//socket.emit("addProducts", )

//socket.emit("deleteProducts", )
