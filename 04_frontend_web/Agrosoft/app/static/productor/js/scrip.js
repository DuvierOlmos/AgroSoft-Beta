function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}

function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave));
    return datos;
}

let productos = obtenerAlmacenamientoLocal('productos') || [];
let mensaje = document.getElementById('mensaje');

const añadirProducto = document.getElementById('ProductoAnadir');
const añadirValor = document.getElementById('ValorAnadir');
const añadirExistencia = document.getElementById('ExistenciaAnadir');
const añadirImagen = document.getElementById('ImagenAnadir');

document.getElementById("botonAnadir").addEventListener("click", function (event) {
    event.preventDefault();

    let productoAnadir = añadirProducto.value.trim();
    let valorAnadir = añadirValor.value.trim();
    let existenciaAnadir = añadirExistencia.value.trim();
    let imagenAnadir = añadirImagen.value.trim();

    let van = true;

    if (productoAnadir === '' || valorAnadir === '' || existenciaAnadir === '' || imagenAnadir === '') {
        mensaje.className = 'llenarCampos';
        mensaje.textContent = 'Por favor llena todos los campos.';
        setTimeout(() => {
            mensaje.className = '';
            mensaje.textContent = '';
        }, 2500);
        van = false;
    } else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre.toLowerCase() === productoAnadir.toLowerCase()) {
                mensaje.className = 'repetidoError';
                mensaje.textContent = 'El producto ya existe.';
                setTimeout(() => {
                    mensaje.className = '';
                    mensaje.textContent = '';
                }, 2500);
                van = false;
                break;
            }
        }
    }

    if (van === true) {
        productos.push({
            nombre: productoAnadir,
            valor: valorAnadir,
            existencia: existenciaAnadir,
            urlImagen: imagenAnadir
        });

        guardarAlmacenamientoLocal('productos', productos);

        mensaje.className = 'realizado';
        mensaje.textContent = 'Producto añadido correctamente.';
        setTimeout(() => {
            mensaje.className = '';
            mensaje.textContent = '';
            window.location.reload();
        }, 1500);
    }
});

const productoEd = document.getElementById('productoEditar')
const atributoEd = document.getElementById('atributoEditar')
const nuevoAtributoEd = document.getElementById('nuevoAtributo')

document.getElementById("botonEditar").addEventListener("click", function (event) {
    event.preventDefault()
    let productoEditar = productoEd.value
    let atributoEditar = atributoEd.value
    let nuevoAtributo = nuevoAtributoEd.value
    let van = false

     if (productoEditar == '' || atributoEditar == '' || nuevoAtributo == '') {
        mensaje.classList.add('llenarCampos')
        setTimeout(() => { mensaje.classList.remove('llenarCampos') }, 2500)
    }
     else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre == productoEditar) {
                productos[i][atributoEditar] = nuevoAtributo
                van = true
            }
        }
        if (van== true){
            mensaje.classList.add('realizado')
            setTimeout(()=>{
                mensaje.classList.remove('realizado')
                window.location.reload()
            }, 1500);
        }
        else{
            mensaje.classList.add('noExisteError')
            setTimeout(()=>{
                mensaje.classList.remove('noExisteError')
            window,location.reload()
        }, 2500);

        }
        guardarAlmacenamientoLocal('productos', productos);
    }
})


const productoE = document.getElementById('productoEliminar')

document.getElementById("botonEliminar").addEventListener("click", function (event) {
    event.preventDefault()
    let productoEliminar = productoE.value
    let van = false

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre == productoEliminar) {
            productos.splice(i, 1)
            van = true
        }
    }

    if (van == false) {
        mensaje.classList.add('noExsiteError')
        setTimeout(() => { mensaje.classList.remove('noExsiteError') }, 2500);
    }
    else {
        mensaje.classList.add('realizado')
        setTimeout(() => {
            mensaje.classList.remove('realizado')
            window.location.reload()
        }, 1500);
    }
    guardarAlmacenamientoLocal('productos', productos);
})


window.addEventListener("load", () => {
    const productoEd = document.getElementById('productoEditar')
    const productoEl = document.getElementById('productoEliminar')
    for (let i = 0; i < productos.length; i++) {
        productoEd.innerHTML += `<option>${productos[i].nombre}</option>`
        productoEl.innerHTML += `<option>${productos[i].nombre}</option>`
    }
    Object.keys(productos[0]).forEach(element => {
        atributoEd.innerHTML += `<option>${element}</option>`
    });
       let mostraProductos = document.getElementById('mostrarProductos')
    for (let i = 0; i < productos.length; i++) {
        mostraProductos.innerHTML += `<div class="contenedorProductos"><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio"><span>Precio: ${productos[i].valor}$</span></p> Existencia: ${productos[i].existencia}<p></p></div></div>`
    }
})