class Movimiento {
    constructor(descripcion, monto) {
        this.descripcion = descripcion;
        this.monto = monto;
    }

    esPositivo() {
        return this.monto >= 0;
    }

    getMontoFormateado() {
        return `$${Math.abs(this.monto).toLocaleString()}.00`;
    }
}

class DiaMovimientos {
    constructor(dia, transacciones) {
        this.dia = dia;
        this.transacciones = transacciones.map(
            (transaccion) => new Movimiento(transaccion.descripcion, transaccion.monto)
        );
    }

    render() {
        const diaDiv = document.createElement("div");
        diaDiv.classList.add("movimientos-dia");

        const diaTitulo = document.createElement("h3");
        diaTitulo.textContent = this.dia;
        diaDiv.appendChild(diaTitulo);

        this.transacciones.forEach((movimiento) => {
            const movimientoDiv = document.createElement("div");
            movimientoDiv.classList.add("movimiento");

            const descripcionSpan = document.createElement("span");
            descripcionSpan.classList.add("movimiento-descripcion");
            descripcionSpan.textContent = movimiento.descripcion;

            const montoSpan = document.createElement("span");
            montoSpan.classList.add("movimiento-monto");
            montoSpan.classList.add(movimiento.esPositivo() ? "positivo" : "negativo");
            montoSpan.textContent = movimiento.getMontoFormateado();

            movimientoDiv.appendChild(descripcionSpan);
            movimientoDiv.appendChild(montoSpan);
            diaDiv.appendChild(movimientoDiv);
        });

        return diaDiv;
    }
}

class MovimientosApp {
    constructor(movimientos) {
        this.movimientos = movimientos.map(
            (dia) => new DiaMovimientos(dia.dia, dia.transacciones)
        );
    }

    render() {
        const movimientosContainer = document.getElementById("movimientos-container");
        movimientosContainer.innerHTML = "";

        this.movimientos.forEach((diaMovimientos) => {
            movimientosContainer.appendChild(diaMovimientos.render());
        });
    }

    buscarMovimientos(query) {
        const movimientosContainer = document.getElementById("movimientos-container");
        movimientosContainer.innerHTML = "";

        this.movimientos.forEach((diaMovimientos) => {
            const diaDiv = diaMovimientos.render();

            const transaccionesFiltradas = diaMovimientos.transacciones.filter(
                (movimiento) =>
                    movimiento.descripcion.toLowerCase().includes(query.toLowerCase())
            );

            if (transaccionesFiltradas.length > 0) {
                movimientosContainer.appendChild(diaDiv);
            }
        });
    }
}

// Datos iniciales
const movimientosData = [
    {
        dia: "Sábado",
        transacciones: [
            { descripcion: "Daniela Buitrago Guti...", monto: -20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: 20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: -20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: 20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: 20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: 20000 },
            { descripcion: "Daniela Buitrago Guti...", monto: 20000 },

        ],
    },
    {
        dia: "7 de Diciembre de 2024",
        transacciones: [
            { descripcion: "Manuel Fernando Buit...", monto: -11000 },
            { descripcion: "Manuel Fernando Buit...", monto: 11000 },
        ],
    },
];

// Inicialización de la app
const app = new MovimientosApp(movimientosData);
app.render();

// Agregar funcionalidad al buscador
document.getElementById("search-bar").addEventListener("input", (e) => {
    const query = e.target.value;
    app.buscarMovimientos(query);
});
