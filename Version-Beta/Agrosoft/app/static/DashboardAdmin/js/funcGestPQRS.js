


const pqrsForm = document.getElementById("pqrsForm");
  const pqrsTable = document.querySelector("#pqrsTable tbody");
  const buscarPQRS = document.getElementById("buscarPQRS");

  function getPQRS() {
    return JSON.parse(localStorage.getItem("pqrs")) || [];
  }

  function savePQRS(pqrs) {
    localStorage.setItem("pqrs", JSON.stringify(pqrs));
  }

  function renderPQRS() {
    const pqrs = getPQRS();
    const filtro = buscarPQRS.value.toLowerCase();
    pqrsTable.innerHTML = "";
    pqrs.forEach((item, index) => {
      if (
        item.nombre.toLowerCase().includes(filtro) ||
        item.email.toLowerCase().includes(filtro) ||
        item.tipo.toLowerCase().includes(filtro) ||
        item.estado.toLowerCase().includes(filtro)
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.nombre}</td>
          <td>${item.email}</td>
          <td>${item.tipo}</td>
          <td>${item.mensaje}</td>
          <td>${item.estado}</td>
          <td>${item.respuesta || "-"}</td>
          <td>
            <button class="edit-btn" onclick="responderPQRS(${index})"><i class="fas fa-reply"></i></button>
          </td>
        `;
        pqrsTable.appendChild(row);
      }
    });
  }

  function responderPQRS(index) {
    const pqrs = getPQRS();
    const item = pqrs[index];
    const respuesta = prompt(`Responder a ${item.tipo} de ${item.nombre}:`, item.respuesta || "");
    if (respuesta !== null && respuesta.trim() !== "") {
      item.respuesta = respuesta.trim();
      item.estado = "Respondido";
      savePQRS(pqrs);
      renderPQRS();
      alert("Respuesta enviada correctamente.");
    }
  }

  pqrsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("pqrsNombre").value;
    const email = document.getElementById("pqrsEmail").value;
    const tipo = document.getElementById("pqrsTipo").value;
    const mensaje = document.getElementById("pqrsMensaje").value;
    const nuevo = { nombre, email, tipo, mensaje, estado: "Pendiente", respuesta: "" };
    const lista = getPQRS();
    lista.push(nuevo);
    savePQRS(lista);
    pqrsForm.reset();
    renderPQRS();
    alert("PQRS enviada correctamente.");
  });

  buscarPQRS.addEventListener("input", renderPQRS);
  renderPQRS();
