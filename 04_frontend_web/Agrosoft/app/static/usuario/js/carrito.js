document.addEventListener('DOMContentLoaded', () => {
  const botonesAgregar = document.querySelectorAll('.agregar');
  const carritoItemsContainer = document.querySelector('.carrito-items');
  const totalCarritoElement = document.querySelector('.carrito-precio-total');

  // Función para formatear el precio a formato de moneda local
  function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // Función para actualizar el total del carrito en el HTML
  function actualizarTotal() {
    let totalActual = 0;
    const itemsEnCarrito = carritoItemsContainer.querySelectorAll('.carrito-item');
    itemsEnCarrito.forEach(item => {
      const precioTexto = item.querySelector('.carrito-item-precio').textContent.replace('$', '').replace(/\./g, '').replace(',', '');
      const precio = parseFloat(precioTexto);
      const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
      totalActual += precio * cantidad;
    });
    totalCarritoElement.textContent = formatearPrecio(totalActual);
  }

  // Función para cambiar la cantidad de un item en el carrito
  function cambiarCantidad(itemCarrito, cambio) {
    const inputCantidad = itemCarrito.querySelector('.carrito-item-cantidad');
    let cantidadActual = parseInt(inputCantidad.value);
    let nuevaCantidad = cantidadActual + cambio;
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    inputCantidad.value = nuevaCantidad;
    actualizarTotal();
  }

  // Función para agregar un producto al carrito
  function agregarAlCarrito(evento) {
    const producto = evento.target.closest('.product');
    const titulo = producto.querySelector('h3').textContent;
    const precioTexto = producto.querySelector('p').textContent;
    const precio = parseInt(precioTexto.replace('$', '').replace(/\./g, ''));
    const imagen = producto.querySelector('img').src;

    // Buscar si el producto ya existe en el carrito
    const items = carritoItemsContainer.querySelectorAll('.carrito-item');
    for (let item of items) {
      const nombre = item.querySelector('.carrito-titulo').textContent;
      if (nombre === titulo) {
        const inputCantidad = item.querySelector('.carrito-item-cantidad');
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
        actualizarTotal();
        return;
      }
    }

    // Si no existe, lo añade como nuevo
    const nuevoItem = document.createElement('div');
    nuevoItem.classList.add('carrito-item');
    nuevoItem.innerHTML = `
      <img src="${imagen}" alt="Producto" width="80px" />
      <div class="carrito-item-detalles">
        <span class="carrito-titulo">${titulo}</span>
        <div class="selector-cantidad">
          <i class="fa-solid fa-minus restar-catidad"></i>
          <input type="number" value="1" min="1" class="carrito-item-cantidad" />
          <i class="fa-solid fa-plus sumar-cantidad"></i>
        </div>
        <span class="carrito-item-precio">${formatearPrecio(precio)}</span>
      </div>
      <span class="eliminar"><i class="fa-solid fa-trash"></i></span>
    `;
    carritoItemsContainer.appendChild(nuevoItem);

    // Eventos para el nuevo item
    nuevoItem.querySelector('.restar-catidad').addEventListener('click', () => cambiarCantidad(nuevoItem, -1));
    nuevoItem.querySelector('.sumar-cantidad').addEventListener('click', () => cambiarCantidad(nuevoItem, 1));
    nuevoItem.querySelector('.eliminar').addEventListener('click', () => {
      nuevoItem.remove();
      actualizarTotal();
    });
    nuevoItem.querySelector('.carrito-item-cantidad').addEventListener('change', actualizarTotal);

    actualizarTotal();
  }

  // Vincula los eventos a los botones "Agregar"
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
  });

  // *** Event listeners para elementos estáticos del carrito ***
  const botonesEliminarEstaticos = carritoItemsContainer.querySelectorAll('.carrito-item .eliminar');
  botonesEliminarEstaticos.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', (event) => {
      const itemAEliminar = event.target.closest('.carrito-item');
      itemAEliminar.remove();
      actualizarTotal();
    });
  });

  const botonesSumarEstaticos = carritoItemsContainer.querySelectorAll('.carrito-item .sumar-cantidad');
  botonesSumarEstaticos.forEach(botonSumar => {
    botonSumar.addEventListener('click', (event) => {
      const itemACambiar = event.target.closest('.carrito-item');
      cambiarCantidad(itemACambiar, 1);
    });
  });

  const botonesRestarEstaticos = carritoItemsContainer.querySelectorAll('.carrito-item .restar-catidad');
  botonesRestarEstaticos.forEach(botonRestar => {
    botonRestar.addEventListener('click', (event) => {
      const itemACambiar = event.target.closest('.carrito-item');
      cambiarCantidad(itemACambiar, -1);
    });
  });

  const inputsCantidadEstaticos = carritoItemsContainer.querySelectorAll('.carrito-item .carrito-item-cantidad');
  inputsCantidadEstaticos.forEach(inputCantidad => {
    inputCantidad.addEventListener('change', actualizarTotal);
  });
  // *** Fin de los event listeners para elementos estáticos ***

  // Inicializar el total del carrito al cargar la página
  actualizarTotal();
});
