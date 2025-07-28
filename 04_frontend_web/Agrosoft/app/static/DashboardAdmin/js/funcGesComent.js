/**const buscarComentario = document.getElementById("buscarComentario");
  const comentarioTable = document.querySelector("#comentarioTable tbody");

  function getComentarios() {
    return JSON.parse(localStorage.getItem("comentarios")) || [];
  }

  function saveComentarios(lista) {
    localStorage.setItem("comentarios", JSON.stringify(lista));
  }

  function renderComentarios() {
    const comentarios = getComentarios();
    const filtro = buscarComentario.value.toLowerCase();
    comentarioTable.innerHTML = "";
    comentarios.forEach((item, index) => {
      if (
        item.nombre.toLowerCase().includes(filtro) ||
        item.producto.toLowerCase().includes(filtro)
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.producto}</td>
          <td>${item.comentario}</td>
          <td>${item.calificacion}</td>
          <td>
            <button class="delete-btn" onclick="eliminarComentario(${index})"><i class="fas fa-trash"></i></button>
          </td>
        `;
        comentarioTable.appendChild(row);
      }
    });
  }

  function eliminarComentario(index) {
    if (confirm("¿Deseas eliminar este comentario?")) {
      const comentarios = getComentarios();
      comentarios.splice(index, 1);
      saveComentarios(comentarios);
      renderComentarios();
      alert("Comentario eliminado correctamente.");
    }
  }

  buscarComentario.addEventListener("input", renderComentarios);
  renderComentarios();**/
  const buscarComentario = document.getElementById("buscarComentario");
  const comentarioTable = document.querySelector("#comentarioTable tbody");
  const comentarioForm = document.getElementById("comentarioForm");
  const nombreInput = document.getElementById("comentarioNombre");
  const productoInput = document.getElementById("comentarioProducto");
  const textoInput = document.getElementById("comentarioTexto");
  const calificacionInput = document.getElementById("comentarioCalificacion");
  const indiceInput = document.getElementById("comentarioIndice");

  function getComentarios() {
    return JSON.parse(localStorage.getItem("comentarios")) || [];
  }

  function saveComentarios(lista) {
    localStorage.setItem("comentarios", JSON.stringify(lista));
  }

  function renderComentarios() {
    const comentarios = getComentarios();
    const filtro = buscarComentario.value.toLowerCase();
    comentarioTable.innerHTML = "";
    comentarios.forEach((item, index) => {
      if (
        item.nombre.toLowerCase().includes(filtro) ||
        item.producto.toLowerCase().includes(filtro)
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.producto}</td>
          <td>${item.comentario}</td>
          <td>${item.calificacion}</td>
          <td>
            <button class="edit-btn" onclick="editarComentario(${index})"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="eliminarComentario(${index})"><i class="fas fa-trash"></i></button>
          </td>
        `;
        comentarioTable.appendChild(row);
      }
    });
  }

  function eliminarComentario(index) {
    if (confirm("¿Deseas eliminar este comentario?")) {
      const comentarios = getComentarios();
      comentarios.splice(index, 1);
      saveComentarios(comentarios);
      renderComentarios();
      alert("Comentario eliminado correctamente.");
    }
  }

  function editarComentario(index) {
    const comentarios = getComentarios();
    const comentario = comentarios[index];
    nombreInput.value = comentario.nombre;
    productoInput.value = comentario.producto;
    textoInput.value = comentario.comentario;
    calificacionInput.value = comentario.calificacion;
    indiceInput.value = index;
  }

  comentarioForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = nombreInput.value;
    const producto = productoInput.value;
    const comentarioTexto = textoInput.value;
    const calificacion = calificacionInput.value;
    const indice = indiceInput.value;
    const comentarios = getComentarios();

    if (indice === "") {
      comentarios.push({ nombre, producto, comentario: comentarioTexto, calificacion });
    } else {
      comentarios[indice] = { nombre, producto, comentario: comentarioTexto, calificacion };
    }
    saveComentarios(comentarios);
    comentarioForm.reset();
    indiceInput.value = "";
    renderComentarios();
    alert("Comentario guardado correctamente.");
  });

  buscarComentario.addEventListener("input", renderComentarios);
  renderComentarios();