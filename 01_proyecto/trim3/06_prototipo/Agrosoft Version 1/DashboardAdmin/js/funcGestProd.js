const productForm = document.getElementById("productForm");
const productTable = document.querySelector("#productTable tbody");

function getProducts() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function saveProducts(products) {
  localStorage.setItem("productos", JSON.stringify(products));
}

function renderProducts() {
  const products = getProducts();
  productTable.innerHTML = "";
  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.nombre}</td>
      <td>${product.precio}</td>
      <td>${product.categoria}<td>
            <button class="edit-btn" onclick='editUser(${index})'><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick='deleteUser(${index})'><i class="fas fa-trash-alt"></i></button>
          </td>
        
`;
    productTable.appendChild(row);
  });
}

function editProduct(index) {
  const products = getProducts();
  const product = products[index];
  document.getElementById("productId").value = index;
  document.getElementById("productName").value = product.nombre;
  document.getElementById("productPrice").value = product.precio;
  document.getElementById("productCategory").value = product.categoria;
}

function deleteProduct(index) {
  let products = getProducts();
  products.splice(index, 1);
  saveProducts(products);
  renderProducts();
}

productForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const nombre = document.getElementById("productName").value;
  const precio = document.getElementById("productPrice").value;
  const categoria = document.getElementById("productCategory").value;

  let products = getProducts();
  if (id) {
    // Editar producto
    products[id] = { nombre, precio, categoria };
  } else {
    // Agregar nuevo producto
    products.push({ nombre, precio, categoria });
  }
  saveProducts(products);
  renderProducts();
  productForm.reset();
});

renderProducts();

function renderProducts(filtro = "") {
    const products = getProducts();
    productTable.innerHTML = "";
  
    products
      .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()) || p.categoria.toLowerCase().includes(filtro.toLowerCase()))
      .forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${product.nombre}</td>
          <td>${product.precio}</td>
          <td>${product.categoria}</td>
          <td>
            <button class="edit-btn" onclick='editProduct(${index})'><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick='deleteProduct(${index})'><i class="fas fa-trash-alt"></i></button>
          </td>
        `;
        productTable.appendChild(row);
      });}
      document.getElementById("productSearch").addEventListener("input", function () {
        renderProducts(this.value);
      });
