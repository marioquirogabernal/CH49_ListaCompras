const btnAgregar = document.getElementById("btnAgregar")
const btnLimpiar = document.getElementById("btnClear")
const txtName = document.getElementById("Name")
const txtNumber = document.getElementById("Number")
const divAlert = document.getElementById("alertValidaciones")
const txtAlert = document.getElementById("alertValidacionesTexto")
const tabla = document.getElementById("tablaListaCompras")
const cuerpoTabla = tabla.getElementsByTagName("tbody")[0]
const productos_total = document.getElementById("productosTotal")
const precio_total = document.getElementById("precioTotal")
const resumen = document.getElementById("contadorProductos")

let contador = 0
let total_precio = 0
let total_productos = 0
let datosTabla = []

function validarNombre(nombre){
    // Validar si está vacío después de recortar
    if (nombre === "") {
        return "El nombre no puede estar vacío.";
    }

    // Validar longitud mínima y máxima
    if (nombre.length < 3 || nombre.length > 50) {
        return "El nombre debe tener entre 3 y 50 caracteres.";
    }

    // Validar que solo contenga letras y espacios
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(nombre)) {
        return "El nombre solo puede contener letras y espacios.";
    }

    // Validar que no tenga más de un espacio consecutivo
    if (/\s{2,}/.test(nombre)) {
        return "El nombre no debe contener más de un espacio consecutivo.";
    }

    // Validación aprobada
    return true;
}

function validarCantidad(numero){
    // Comprobar si hay contenido
    if (numero.length<=0){
        return "La cantidad no puede estar vacía."
    }
     // Comprobar si el valor es un número
     if (isNaN(numero)) {
        return "El valor ingresado no es un número.";
    }
    // Comprobar si el número es mayor que 0
    numero = Number(numero)
    if (Number(numero) <= 0) {
        return "El número debe ser positivo y mayor que 0.";
    }

    // Si pasa ambas validaciones
    return true;
}

function crearAlerta(txtCampo, mensaje){
    txtCampo.style.border = "solid red medium"
    txtCampo.style.boxShadow = "0 0 5px red";
    txtAlert.insertAdjacentHTML("beforeend",`<p><strong>${mensaje}</strong></p>`)
    divAlert.style.display = "block"
    return false
}

function almacenarValoresLocalStorage(){
    localStorage.setItem("total_precio", total_precio)
    localStorage.setItem("total_productos", total_productos)
    localStorage.setItem("contador", contador)
    localStorage.setItem("datosTabla", datosTabla)
}

function almacenarTablaLocalStorage(contador, nombre, cantidad, precio){
    let objetoTabla = {
        "contador":contador,
        "nombre":nombre,
        "cantidad": cantidad,
        "precio": precio
    }
    datosTabla.push(objetoTabla)
    localStorage.setItem("datosTabla", JSON.stringify(datosTabla))
}

function reiniciarValores(){
    txtName.style.border = "";
    txtName.style.boxShadow = "";
    txtNumber.style.border = "";
    txtNumber.style.boxShadow = "";
    txtAlert.innerHTML= ""
    divAlert.style.display = "none"
    txtName.value = txtName.value.trim()
    txtNumber.value = txtNumber.value.trim()
}

function limpiarValoresGenerales(){
    contador = 0
    total_productos = 0
    total_precio = 0
    datosTabla = []

    productos_total.textContent = total_productos
    precio_total.textContent = `$ ${total_precio}`
    resumen.textContent = contador

    cuerpoTabla.innerHTML = ""

    almacenarValoresLocalStorage()
}

function actualizarValoresTabla(precio){
    contador += 1
    total_productos += Number(txtNumber.value)
    total_precio += (precio * total_productos)

    productos_total.textContent = total_productos
    precio_total.textContent = `$ ${total_precio.toFixed(2)}`
    resumen.textContent = contador

    almacenarValoresLocalStorage()
}

function anadirElementoTabla(nombre, cantidad){
    let precio = Math.round(Math.random() * 10000)/100
    actualizarValoresTabla(precio)
    let fila = `
    <tr>
      <td>${contador}</td>
      <td>${nombre}</td>
      <td>${cantidad}</td>
      <td>${precio}</td>
    </tr>
    `
    cuerpoTabla.insertAdjacentHTML("beforeend", fila)
    almacenarTablaLocalStorage(contador, nombre, cantidad,precio)
}

function escribirElemento(){
    txtName.value=""
    txtNumber.value=""
    txtName.focus()
}

function recrearTabla(){
    for (elemento of datosTabla){
        let fila = `
            <tr>
            <td>${elemento.contador}</td>
            <td>${elemento.nombre}</td>
            <td>${elemento.cantidad}</td>
            <td>${elemento.precio}</td>
            </tr>
            `
        cuerpoTabla.insertAdjacentHTML("beforeend", fila)
    }
}

function obteniendoDatos(){
    if (this.localStorage.getItem("total_precio")!= null){
        total_precio = Number(this.localStorage.getItem("total_precio"))
        total_productos = Number(this.localStorage.getItem("total_productos"))
        contador = Number(this.localStorage.getItem("contador"))
    }
    
    if (localStorage.getItem("datosTabla", datosTabla) != "" && localStorage.getItem("datosTabla", datosTabla) != null){
        datosTabla = JSON.parse(localStorage.getItem("datosTabla", datosTabla))
        recrearTabla()
    }

    productos_total.textContent = total_productos
    precio_total.textContent = `$ ${total_precio.toFixed(2)}`
    resumen.textContent = contador
}

btnAgregar.addEventListener("click", (event) => {
    event.preventDefault()
    let is_valid = true
    reiniciarValores() //reinica los valores del alert
    let nombre_es_valido = validarNombre(txtName.value)
    let cantidad_es_valido = validarCantidad(txtNumber.value)
    if (nombre_es_valido != true){
        is_valid = crearAlerta(txtName, nombre_es_valido)
    }
    if (cantidad_es_valido != true){
        is_valid = crearAlerta(txtNumber, cantidad_es_valido)
    }
    if (is_valid){
        anadirElementoTabla(txtName.value, txtNumber.value)
        escribirElemento()
    }
}) // boton Agregar => click

btnLimpiar.addEventListener("click", (event) => {
    reiniciarValores()
    escribirElemento()
    limpiarValoresGenerales()
})

window.addEventListener("load", function(event){
    obteniendoDatos()
})