const pedidoForm = document.getElementById("pedidoForm");
  const pedidoTable = document.querySelector("#pedidoTable tbody");
  const buscarPedido = document.getElementById("buscarPedido");

  function getPedidos() {
    return JSON.parse(localStorage.getItem("pedidos")) || [];
  }

  function savePedidos(pedidos) {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }

  function renderPedidos() {
    const pedidos = getPedidos();
    const filtro = buscarPedido.value.toLowerCase();
    pedidoTable.innerHTML = "";
    pedidos.forEach((pedido, index) => {
      if (
        pedido.cliente.toLowerCase().includes(filtro) ||
        pedido.producto.toLowerCase().includes(filtro)
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${pedido.cliente}</td>
          <td>${pedido.producto}</td>
          <td>${pedido.cantidad}</td>
          <td>${pedido.estado}</td>
          <td>
            <button onclick="verDetallesPedido(${index})">Ver Detalles</button>
            <select onchange="actualizarEstado(${index}, this.value)">
              <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="Enviado" ${pedido.estado === "Enviado" ? "selected" : ""}>Enviado</option>
              <option value="Entregado" ${pedido.estado === "Entregado" ? "selected" : ""}>Entregado</option>
            </select>
          </td>
        `;
        pedidoTable.appendChild(row);
      }
    });
  }

  function verDetallesPedido(index) {
    const pedidos = getPedidos();
    const pedido = pedidos[index];
    alert(`Detalles del pedido:\n\nCliente: ${pedido.cliente}\nProducto: ${pedido.producto}\nCantidad: ${pedido.cantidad}\nEstado: ${pedido.estado}`);
  }

  function actualizarEstado(index, nuevoEstado) {
    const pedidos = getPedidos();
    pedidos[index].estado = nuevoEstado;
    savePedidos(pedidos);
    renderPedidos();
    alert("Estado actualizado a " + nuevoEstado);
  }

  pedidoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const cliente = document.getElementById("pedidoCliente").value;
    const producto = document.getElementById("pedidoProducto").value;
    const cantidad = parseInt(document.getElementById("pedidoCantidad").value);
    const estado = document.getElementById("pedidoEstado").value;
    const nuevoPedido = { cliente, producto, cantidad, estado };
    const pedidos = getPedidos();
    pedidos.push(nuevoPedido);
    savePedidos(pedidos);
    pedidoForm.reset();
    renderPedidos();
    alert("Pedido registrado correctamente.");
  });

  buscarPedido.addEventListener("input", renderPedidos);

  renderPedidos();