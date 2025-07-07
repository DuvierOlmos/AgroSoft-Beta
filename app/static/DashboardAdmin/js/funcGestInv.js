const inventarioForm = document.getElementById("inventarioForm");
const inventarioTable = document.querySelector("#inventarioTable tbody");

function getInventario() {
  return JSON.parse(localStorage.getItem("inventario")) || [];
}

function saveInventario(lista) {
  localStorage.setItem("inventario", JSON.stringify(lista));
}

function renderInventario() {
  const lista = getInventario();
  inventarioTable.innerHTML = "";
  lista.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.codigo}</td>
      <td>${item.nombre}</td>
      <td>${item.categoria}</td>
      <td>${item.stock}</td>
      <td>
        <button class="edit-btn" onclick="editarInventario(${index})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="eliminarInventario(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    inventarioTable.appendChild(row);
  });
}

function editarInventario(index) {
  const lista = getInventario();
  const item = lista[index];
  document.getElementById("inventarioId").value = index;
  document.getElementById("codigo").value = item.codigo;
  document.getElementById("nombreProducto").value = item.nombre;
  document.getElementById("categoria").value = item.categoria;
  document.getElementById("stock").value = item.stock;
}

function eliminarInventario(index) {
  let lista = getInventario();
  lista.splice(index, 1);
  saveInventario(lista);
  renderInventario();
}

inventarioForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("inventarioId").value;
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombreProducto").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const stock = parseInt(document.getElementById("stock").value);

  let lista = getInventario();

  if (id) {
    lista[id] = { codigo, nombre, categoria, stock };
  } else {
    lista.push({ codigo, nombre, categoria, stock });
  }

  saveInventario(lista);
  renderInventario();
  inventarioForm.reset();
});

function buscarInventario() {
  const termino = document.getElementById("buscarInventario").value.trim().toLowerCase();
  const lista = getInventario();
  inventarioTable.innerHTML = "";

  lista.forEach((item, index) => {
    if (
      item.codigo.toLowerCase().includes(termino) ||
      item.nombre.toLowerCase().includes(termino) ||
      item.categoria.toLowerCase().includes(termino)
    ) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>${item.categoria}</td>
        <td>${item.stock}</td>
        <td>
          <button class="edit-btn" onclick="editarInventario(${index})"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick="eliminarInventario(${index})"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      inventarioTable.appendChild(row);
    }
  });
}

renderInventario();