document.addEventListener('DOMContentLoaded', () => {
    const imagenesUsuarios = document.querySelectorAll('.usuario-perfil img');
    const modalPedido = document.getElementById('info-pedido-usuario');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const nombreClienteModal = document.getElementById('nombre-cliente-modal');
    const listaProductosPedido = document.getElementById('lista-productos-pedido');
    const notificacionPedidoElement = document.getElementById('notificacion-pedido');
    const nombreClienteNotifElement = document.getElementById('nombre-cliente-pedido-notif');

    // Simulación de datos de pedidos por cliente (esto vendría de tu backend)
    const pedidosClientes = {
        "1": ["Producto: Tomate" ,"Cantidad: 2L", "Producto: Fresas ","Cantidad: 2L", "Producto: Papa ","Cantidad: 2L"],
        "2": ["Producto: Tomate ","Cantidad: 5L", "Producto: Uvas"," Catidad:1L"],
        "3": ["Producto: Papa"," Cantidad: 8L"],
        // ... más pedidos de clientes ...
    };

    // Función para mostrar la notificación de pedido
    function mostrarNotificacionPedido(nombreCliente) {
        nombreClienteNotifElement.textContent = nombreCliente;
        notificacionPedidoElement.classList.add('mostrar');

        // Ocultar la notificación después de unos segundos
        setTimeout(() => {
            notificacionPedidoElement.classList.remove('mostrar');
        }, 3000); // 3 segundos
    }

    // Evento para mostrar la información del pedido al hacer clic en la imagen del usuario
    imagenesUsuarios.forEach(imagen => {
        imagen.addEventListener('click', () => {
            const clienteId = imagen.dataset.clienteId;
            const nombreCliente = imagen.alt.replace('Foto de ', ''); // Obtener el nombre del alt

            if (pedidosClientes[clienteId]) {
                nombreClienteModal.textContent = nombreCliente;
                listaProductosPedido.innerHTML = ''; // Limpiar la lista anterior
                pedidosClientes[clienteId].forEach(producto => {
                    const li = document.createElement('li');
                    li.textContent = producto;
                    listaProductosPedido.appendChild(li);
                });
                modalPedido.style.display = "block";
            } else {
                alert(`No se encontraron pedidos para ${nombreCliente}.`);
            }
        });
    });

    // Evento para cerrar el modal al hacer clic en la "x"
    cerrarModal.addEventListener('click', () => {
        modalPedido.style.display = "none";
    });

    // Evento para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modalPedido) {
            modalPedido.style.display = "none";
        }
    });

    // Ejemplo de cómo podrías simular la recepción de un nuevo pedido
    // (Esto se activaría cuando tu lógica de pedido se complete)
    setTimeout(() => {
        const clienteNuevoPedido = 'Juan Rodríguez'; // Simulación de un nuevo pedido
        mostrarNotificacionPedido(clienteNuevoPedido);
    }, 5000); // Simulación después de 5 segundos
});