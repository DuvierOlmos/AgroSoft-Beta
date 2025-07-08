const categoryForm = document.getElementById("categoryForm");
const categoryTableBody = document.querySelector("#categoryTable tbody");
const inputSearch = document.getElementById("productSearch");

// ✅ Cargar categorías desde la API y renderizar la tabla
async function cargarCategorias(filtro = "") {
  try {
    const res = await fetch("/admin/api/categorias");
    const categorias = await res.json();

    const filtradas = categorias.filter(cat =>
      cat.nombre_categoria.toLowerCase().includes(filtro.toLowerCase()) ||
      cat.descripcion_categoria.toLowerCase().includes(filtro.toLowerCase())
    );

    categoryTableBody.innerHTML = "";

    filtradas.forEach((cat, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${cat.nombre_categoria}</td>
        <td>${cat.descripcion_categoria}</td>
        <td>${cat.estado}</td>
        <td>
          <button class="edit-btn"
            data-id="${cat.id_categoria}"
            data-nombre="${cat.nombre_categoria}"
            data-descripcion="${cat.descripcion_categoria}">
            <i class="fas fa-edit"></i>
          </button>

          <form action="/admin/cambiar_estado_categoria" method="POST" style="display:inline;">
            <input type="hidden" name="id_categoria" value="${cat.id_categoria}">
            <input type="hidden" name="nuevo_estado" value="${cat.estado === 'Activo' ? 'Inactivo' : 'Activo'}">
            <button type="submit">${cat.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button>
          </form>
        </td>
      `;
      categoryTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

// ✅ Rellenar formulario al hacer clic en botón editar
document.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    const id = editBtn.dataset.id;
    const nombre = editBtn.dataset.nombre;
    const descripcion = editBtn.dataset.descripcion;

    document.getElementById("categoriaid").value = id;
    document.getElementById("categoriaName").value = nombre;
    document.getElementById("categoriaDescripcion").value = descripcion;

    // Mostrar la sección de catálogo si está oculta
    if (typeof showModule === "function") {
      showModule("GestionarCatalogo");
    }
  }
});

// ✅ Filtrado en vivo
inputSearch.addEventListener("input", function () {
  cargarCategorias(this.value);
});

// ✅ Inicializar tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
});
