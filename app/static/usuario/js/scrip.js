function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}

function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave));
    return datos;
}

let productos = [];
let contenedor = document.getElementById('contenedor');

const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const carrito = document.getElementById('carrito');
const numero = document.getElementById("numero");
const header = document.querySelector("#header");
const total = document.getElementById('total');
const x = document.getElementById('x');
const body = document.querySelector("body");

let lista = [];
let valortotal = 0;

window.addEventListener("scroll", function () {
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});

// Al cargar la página, obtener productos desde el backend
window.addEventListener("load", function () {
    fetch("/usuario/productos")
        .then(res => res.json())
        .then(data => {
            productos = data;
            guardarAlmacenamientoLocal('productos', productos);
            visualizarProductos();
            contenedorCompra.classList.add('none');
        })
        .catch(error => {
            console.error("Error al cargar los productos", error);
        });
});

// Mostrar productos disponibles o agotados
function visualizarProductos() {
    contenedor.innerHTML = "";
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].existencia > 0) {
            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${productos[i].urlImagen}" alt="producto">
                    <div class="informacion">
                        <p>${productos[i].nombre}</p>
                        <p class="precio">$${productos[i].valor}</p>
                        <button onclick="comprar(${i})">Comprar</button>
                    </div>
                </div>
            `;
        } else {
            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${productos[i].urlImagen}" alt="producto">
                    <div class="informacion">
                        <p>${productos[i].nombre}</p>
                        <p class="precio">$${productos[i].valor}</p>
                        <p class="soldOut">Sold Out</p>
                    </div>
                </div>
            `;
        }
    }
}

// Al presionar "Comprar"
function comprar(indice) {
    lista.push({ nombre: productos[indice].nombre, precio: productos[indice].valor });

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === productos[indice].nombre) {
            productos[i].existencia -= 1;
            break;
        }
    }

    guardarAlmacenamientoLocal("productos", productos);
    visualizarProductos(); 
    numero.innerHTML = lista.length;
    numero.classList.add("diseñoNumero");
    return lista;
}

// Mostrar productos en el carrito
carrito.addEventListener("click", function () {
    body.style.overflow = "hidden";
    contenedorCompra.classList.remove('none');
    contenedorCompra.classList.add('contenedorCompra');
    informacionCompra.classList.add('informacionCompra');
    mostrarElementosLista();
});

function mostrarElementosLista() {
    productosCompra.innerHTML = "";
    valortotal = 0;

    for (let i = 0; i < lista.length; i++) {
        productosCompra.innerHTML += `
            <div class="producto-carrito">
                <div class="img">
                    <button onclick="eliminar(${i})" class="botonTrash">
                        <img src="/img/botedeBasura.png" alt="Eliminar">
                    </button>
                    <p>${lista[i].nombre}</p>
                </div>
                <p>$${lista[i].precio}</p>
            </div>
        `;
        valortotal += parseInt(lista[i].precio);
    }

    total.innerHTML = `<p>Valor Total</p> <p><span>$${valortotal}</span></p>`;
}

// Eliminar del carrito
function eliminar(indice) {
    const productoNombre = lista[indice].nombre;

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === productoNombre) {
            productos[i].existencia += 1;
            break;
        }
    }

    lista.splice(indice, 1);
    guardarAlmacenamientoLocal("productos", productos);
    visualizarProductos();
    mostrarElementosLista();

    numero.innerHTML = lista.length;
    if (lista.length === 0) {
        numero.classList.remove("diseñoNumero");
    }
}

// Cerrar carrito
x.addEventListener("click", function () {
    body.style.overflow = "auto";
    contenedorCompra.classList.add('none');
    contenedorCompra.classList.remove('contenedorCompra');
    informacionCompra.classList.remove('informacionCompra');
});
