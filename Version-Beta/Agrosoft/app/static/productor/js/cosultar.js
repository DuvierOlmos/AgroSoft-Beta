const productDetailsDiv = document.getElementById('product-details');
const detailIdSpan = document.getElementById('detalle-id'); 
const detailNameSpan = document.getElementById('detalle-nombre'); 
const detailDescriptionSpan = document.getElementById('detalle-descripcion'); 
const detailPriceSpan = document.getElementById('detalle-precio'); 
const errorMessageDiv = document.getElementById('error-mensaje');  
const addFormDiv = document.getElementById('add-form');
const productListDiv = document.getElementById('product-list');
const editFormDiv = document.createElement('div');
//crear editar formulario//

let products = []; 

function displayMessage(message, isError = false){
    errorMessageDiv.textContent = message;
    errorMessageDiv.className = isError ? 'error' : '';
    errorMessageDiv.classList.toggle('hidden', !message);
}
function displayProductDetails(product){
    if(product){
        detailIdSpan.textContent = product.id;
        detailNameSpan.textContent = product.nombre; 
        detailDescriptionSpan.textContent = product.descripcion;
        detailPriceSpan.textContent = product.precio;
        productDetailsDiv.classList.remove('hidden');
    } else {
        displayMessage('Producto no encontrado', true);
        productDetailsDiv.classList.add('hidden');
    }
}
async function getProduct(){
    const productId = document.getElementById('productosId').value; 
    if(!productId){
        displayMessage('Por favor Ingrese el ID del Producto.', true); 
        return;
    }
    const foundProduct = products.find(p => p.id === parseInt(productId)); 
    displayProductDetails(foundProduct);
}
function showAddForm(){
    addFormDiv.classList.remove('hidden');

}
function hideAddForm(){
    addFormDiv.classList.add('hidden');
}
async function addProduct() { 
    const name = document.getElementById('add-nombre').value;
    const descripcion = document.getElementById('add-descripcion').value;
    const precio = parseFloat(document.getElementById('add-precio').value);

    if(!name || isNaN(precio)){
        displayMessage('Por favor, rellena todos los campos correctamente', true);
        return;
    }
    const newProduct = {
        id: Date.now(),
        nombre: name, 
        descripcion,
        precio
    };
    
    products.push(newProduct); 
    displayProducts();
    hideAddForm();
    displayMessage('Producto añadido Exitosamente!');

}
function displayProducts(){
    productListDiv.innerHTML = '<h2>Todos los Productos</h2>'; 
    if(products.length === 0){
        productListDiv.innerHTML += '<p>No hay productos disponibles.</p>'; 
        return;
    }
    products.forEach(product => { 
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <span>${product.name} (ID: ${product.id}) - $${product.precio}</span>
            <div class="product-actions">
                <button class="edit-button" onclick="showEditForm(${product.id})">Editar</button>
                <button class="delete-button"Corregido onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        `;
        productListDiv.appendChild(productItem);
    });

    if(editFormDiv.parentNode === document.body){
        document.body.removeChild(editFormDiv);
    }
}

async function deleteProduct(id) {

    if(confirm('¿Estás seguro de que deseas eliminar este producto?')){
        products = products.filter(p => p.id !== id); 
        displayProducts();
        displayMessage('Producto eliminado Exitosamente');
    }
}
function showEditForm(id){
    const productEditar = products.find(p => p.id === id); 
    if(!productEditar){
        displayMessage('Producto no encontrado para editar', true);
        return;
    }
    editFormDiv.innerHTML = `
        <h3>Editar Producto (ID: ${productEditar.id})</h3>
        <label for="edit-name-${productEditar.id}">Nombre:</label>
        <input type="text" id="edit-name-${productEditar.id}" value="${productEditar.name}"><br><br>
        <label for="edit-description-${productEditar.id}">Descripción:</label>
        <textarea id="edit-description-${productEditar.id}">${productEditar.descripcion}</textarea><br><br>
        <label for="edit-price-${productEditar.id}">Precio:</label>
        <input type="number" id="edit-price-${productEditar.id}" value="${productEditar.precio}"><br><br>
        <button class="save-button" onclick="updateProduct(${productEditar.id})">Guardar</button>
        <button class="cancel-button" onclick="hideEditForm()">Cancelar</button>
    `;
    editFormDiv.id = 'edit-form';
    editFormDiv.className = 'form';
    document.body.appendChild(editFormDiv);
}
function hideEditForm(){
    if(editFormDiv.parentNode === document.body){
        document.body.removeChild(editFormDiv);
    }
}
async function updateProduct(id) {
    const nameInput = document.getElementById(`edit-name-${id}`);
    const descriptionInput = document.getElementById(`edit-description-${id}`);
    const priceInput = document.getElementById(`edit-price-${id}`);

    if(!nameInput || !descriptionInput || !priceInput) return;
    const updatedProduct = {
        id: id,
        nombre: nameInput.value, 
        descripcion: descriptionInput.value,
        precio: parseFloat(priceInput.value)
    };
    if(isNaN(updatedProduct.precio)){
        displayMessage('Por favor ingrese el precio', true);
        return;
    }

    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = updatedProduct;
        displayProducts();
        hideEditForm();
        displayMessage('Producto actualizado exitosamente!');
    } else {
        displayMessage('No se encontró el producto para actualizar.', true);
    }
}
function displayProductDetails(product){
    const closeBtn = document.getElementById('close-details');
    
    if(product){
        detailIdSpan.textContent = product.id;
        detailNameSpan.textContent = product.nombre; 
        detailDescriptionSpan.textContent = product.descripcion;
        detailPriceSpan.textContent = product.precio;

        productDetailsDiv.classList.remove('hidden');
        closeBtn.classList.remove('hidden'); // mostrar botón
    } else {
        displayMessage('Producto no encontrado', true);
        productDetailsDiv.classList.add('hidden');
        closeBtn.classList.add('hidden'); // ocultar si no hay producto
    }
}
function cerrarDetalles() {
    productDetailsDiv.classList.add('hidden');
    document.getElementById('close-details').classList.add('hidden');
}

