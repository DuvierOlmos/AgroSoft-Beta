const descuentoForm = document.getElementById("descuentoForm");
const descuentoTable = document.querySelector("#descuentoTable tbody");

function getDescuentos() {
  return JSON.parse(localStorage.getItem("descuentos")) || [];
}

function saveDescuentos(lista) {
  localStorage.setItem("descuentos", JSON.stringify(lista));
}

function renderDescuentos() {
  const lista = getDescuentos();
  descuentoTable.innerHTML = "";

  lista.forEach((d, index) => {
    const hoy = new Date().toISOString().split('T')[0];
    const vigente = (d.fechaInicio <= hoy && d.fechaFin >= hoy) ? "Sí" : "No";
    const aplica = d.auto === "true" ? "Automático" : "Con código";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${d.nombre}</td>
      <td>${d.codigo}</td>
      <td>${d.porcentaje}%</td>
      <td>${d.fechaInicio} a ${d.fechaFin} (${vigente})</td>
      <td>${aplica}</td>
      <td>
        <button class="edit-btn" onclick="editarDescuento(${index})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="eliminarDescuento(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    descuentoTable.appendChild(row);
  });
}

function editarDescuento(index) {
  const lista = getDescuentos();
  const d = lista[index];
  document.getElementById("descuentoId").value = index;
  document.getElementById("nombreDescuento").value = d.nombre;
  document.getElementById("codigoDescuento").value = d.codigo;
  document.getElementById("porcentaje").value = d.porcentaje;
  document.getElementById("fechaInicio").value = d.fechaInicio;
  document.getElementById("fechaFin").value = d.fechaFin;
  document.getElementById("aplicarAutomaticamente").value = d.auto;
}

function eliminarDescuento(index) {
  const lista = getDescuentos();
  lista.splice(index, 1);
  saveDescuentos(lista);
  renderDescuentos();
}

descuentoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("descuentoId").value;
  const nombre = document.getElementById("nombreDescuento").value.trim();
  const codigo = document.getElementById("codigoDescuento").value.trim();
  const porcentaje = parseInt(document.getElementById("porcentaje").value);
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const auto = document.getElementById("aplicarAutomaticamente").value;

  let lista = getDescuentos();

  if (id) {
    lista[id] = { nombre, codigo, porcentaje, fechaInicio, fechaFin, auto };
  } else {
    lista.push({ nombre, codigo, porcentaje, fechaInicio, fechaFin, auto });
  }

  saveDescuentos(lista);
  renderDescuentos();
  descuentoForm.reset();
});

function buscarDescuento() {
  const term = document.getElementById("buscarDescuento").value.trim().toLowerCase();
  const lista = getDescuentos();
  descuentoTable.innerHTML = "";

  lista.forEach((d, index) => {
    if (d.nombre.toLowerCase().includes(term) || d.codigo.toLowerCase().includes(term)) {
      const hoy = new Date().toISOString().split('T')[0];
      const vigente = (d.fechaInicio <= hoy && d.fechaFin >= hoy) ? "Sí" : "No";
      const aplica = d.auto === "true" ? "Automático" : "Con código";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${d.nombre}</td>
        <td>${d.codigo}</td>
        <td>${d.porcentaje}%</td>
        <td>${d.fechaInicio} a ${d.fechaFin} (${vigente})</td>
        <td>${aplica}</td>
        <td>
          <button class="edit-btn" onclick="editarDescuento(${index})"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick="eliminarDescuento(${index})"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      descuentoTable.appendChild(row);
    }
  });
}

renderDescuentos();
