document.addEventListener('DOMContentLoaded', () => {
    // Simulación de datos de órdenes pendientes (reemplazar con tu lógica real)
    const ordenesPendientesData = [
        {
            numeroPedido: '2025-ORD-001',
            cliente: 'Finca La Esperanza (Usuario: Carlos Pérez)',
            fechaPedido: '2025-04-10',
            fechaEntregaEstimada: '2025-04-15',
            estado: 'Retrasado',
            diasRetraso: 5,
            productos: [{ nombre: 'Fertilizante Orgánico', cantidad: '5 sacos' }, { nombre: 'Semillas de Maíz', cantidad: '2 kg' }],
            notas: 'Retraso debido a problemas con el proveedor del fertilizante.'
        },
        {
            numeroPedido: '2025-ORD-002',
            cliente: 'AgroInsumos del Valle S.A.',
            fechaPedido: '2025-04-12',
            fechaEntregaEstimada: '2025-04-17',
            estado: 'Retrasado',
            diasRetraso: 3,
            productos: [{ nombre: 'Insecticida Biológico', cantidad: '3 litros' }],
            notas: 'Problemas logísticos en la ruta de entrega.'
        },
        {
            numeroPedido: '2025-ORD-003',
            cliente: 'Usuario: Ana Gómez',
            fechaPedido: '2025-04-16',
            fechaEntregaEstimada: '2025-04-19',
            estado: 'Pendiente de Entrega (Dentro del plazo, pero listado aquí)',
            diasRetraso: 0,
            productos: [{ nombre: 'Herramientas de Jardinería', cantidad: '1 set' }],
            notas: 'Entrega programada para mañana.'
        }
        // ... más órdenes pendientes
    ];

    function mostrarOrdenesPendientes(ordenes) {
        const listaOrdenes = document.getElementById('lista-ordenes-retrasadas');
        listaOrdenes.innerHTML = ''; // Limpiar el mensaje de carga

        if (ordenes.length === 0) {
            listaOrdenes.innerHTML = '<p>No hay órdenes pendientes de entrega en este momento.</p>';
            return;
        }

        ordenes.forEach(orden => {
            const ordenItem = document.createElement('div');
            ordenItem.classList.add('orden-retrasada-item');

            const infoOrden = document.createElement('div');
            infoOrden.classList.add('info-orden');

            const titulo = document.createElement('h3');
            titulo.textContent = `Pedido #${orden.numeroPedido}`;

            const clienteInfo = document.createElement('p');
            clienteInfo.innerHTML = `<strong>Usuario/Empresa:</strong> ${orden.cliente}`;

            const fechaPedido = document.createElement('p');
            fechaPedido.innerHTML = `<strong>Fecha de Pedido:</strong> ${orden.fechaPedido}`;

            const fechaEntregaEstimada = document.createElement('p');
            fechaEntregaEstimada.innerHTML = `<strong>Fecha de Entrega Estimada:</strong> ${orden.fechaEntregaEstimada}`;

            const estado = document.createElement('p');
            estado.innerHTML = `<strong>Estado:</strong> <span class="${orden.estado.toLowerCase().replace(/ /g, '-')}">${orden.estado}</span>`;

            const diasRetraso = document.createElement('p');
            diasRetraso.innerHTML = `<strong>Días de Retraso:</strong> ${orden.diasRetraso}`;

            const productos = document.createElement('p');
            productos.innerHTML = `<strong>Productos:</strong> ${orden.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')}`;

            const notas = document.createElement('p');
            notas.innerHTML = `<strong>Notas:</strong> ${orden.notas || 'Sin notas.'}`;

            const botonContacto = document.createElement('button');
            botonContacto.classList.add('boton-contacto');
            botonContacto.textContent = 'Contactar';
            botonContacto.addEventListener('click', () => {
                alert(`Contactando a ${orden.cliente} por el pedido #${orden.numeroPedido}`);
                // Aquí iría la lógica para contactar al cliente
            });

            infoOrden.appendChild(titulo);
            infoOrden.appendChild(clienteInfo);
            infoOrden.appendChild(fechaPedido);
            infoOrden.appendChild(fechaEntregaEstimada);
            infoOrden.appendChild(estado);
            infoOrden.appendChild(diasRetraso);
            infoOrden.appendChild(productos);
            infoOrden.appendChild(notas);
            infoOrden.appendChild(botonContacto);

            ordenItem.appendChild(infoOrden);
            listaOrdenes.appendChild(ordenItem);
        });
    }

    mostrarOrdenesPendientes(ordenesPendientesData);
});