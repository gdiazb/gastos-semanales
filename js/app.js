// Variables y Selectores
const formulario = document.getElementById('agregar-gasto')
const gastosListado = document.querySelector('#gastos ul')
const uiTotal = document.querySelector('#total')
const uiRestante = document.querySelector('#restante')
const uiDivPrimario = document.querySelector('.primario')
const uiBtn = document.querySelector('button[type="submit"]')

// Eventos
eventListener()
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto)
}

// Classes
// presupuesto
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante()
    }

}


// ui
class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad
        uiTotal.textContent = presupuesto
        uiRestante.textContent = restante
    }

    imprimirAlerta(mensaje, type) {
        const uiAlert = document.createElement('div')
        uiAlert.classList.add('text-center', 'alert')

        if(type === 'error') {
            uiAlert.classList.add('alert-danger')
        } else {
            uiAlert.classList.add('alert-success')
        }

        uiAlert.textContent = mensaje
        uiDivPrimario.insertBefore(uiAlert, formulario)

        setTimeout(() => {
            uiAlert.remove()
        }, 3000);
    }

    mostrarGastos(gastos) {
        this.limpiarHTML()
        // iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto
             // Crear un LI
            const uiItem = document.createElement('li')
            uiItem.className = 'list-group-item d-flex justify-content-between align-items-center'
            uiItem.dataset.id = id
            
            // Insertar el gasto
            uiItem.innerHTML = `
                ${nombre}
                <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `

            // boton borrar gasto.
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times;'

            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }

            uiItem.appendChild(btnBorrar)



            // Insertar al HTML
            gastosListado.appendChild(uiItem)
        });
    }

    actualizarRestante(restante) {
        uiRestante.textContent = restante
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj

        if( (presupuesto / 4) > restante) {
            uiRestante.parentElement.parentElement.classList.remove('alert-success', 'alert-warning')
            uiRestante.parentElement.parentElement.classList.add('alert-danger')
        } else if( (presupuesto / 2) > restante) {
            uiRestante.parentElement.parentElement.classList.remove('alert-success')
            uiRestante.parentElement.parentElement.classList.add('alert-warning')
        } else {
            uiRestante.parentElement.parentElement.classList.remove('alert-danger', 'alert-warning');
            uiRestante.parentElement.parentElement.classList.add('alert-success');
        }

        if(restante <= 0) {
            ui.imprimirAlerta('el presupuesto se ha agotado', 'error')
            uiBtn.disabled = true
        }

    }

    limpiarHTML() {
        while(gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }
}

const ui = new UI()
let presupuesto

function preguntarPresupuesto() {
    const presupuestoUsusario = prompt('¿Cual es tu presupuesto?')
    
    const condicionPresupuesto = ((presupuestoUsusario === '') || (presupuestoUsusario === null) || (isNaN(presupuestoUsusario)) || (presupuestoUsusario < 0))

    if(condicionPresupuesto) {
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsusario)
    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto(e) {
    e.preventDefault()
    
    const uiNombreGasto = document.querySelector('#gasto').value
    const uiCantidad = Number(document.querySelector('#cantidad').value)

    if(uiNombreGasto === '' || uiCantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorias', 'error')
        return
    } else if((uiCantidad <= 0) || isNaN(uiCantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error')
        return
    }

    const gasto = {
        nombre: uiNombreGasto,
        cantidad: uiCantidad,
        id: Date.now()
    }

    presupuesto.nuevoGasto(gasto)

    ui.imprimirAlerta('Gasto agregregado correctamente')

    //imprimir los gastos
    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)

    formulario.reset()
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id)

    const { gastos, restante } = presupuesto

    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}
