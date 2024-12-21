class MovimientosApp {
    constructor(containerId, searchBarId) {
        //comprobar si el usuario esta logeado
        if (!localStorage.getItem('usuarioLogueado')) {
            alert('Debes estar logeado para poder ver tus movimientos');
            window.location.href = 'login.html';
            return
        }
        this.container = document.getElementById(containerId);
        this.searchBar = document.getElementById(searchBarId);
        this.users = JSON.parse(localStorage.getItem('usuarios'));
        this.user = this.users.find(e => e.email === JSON.parse(localStorage.getItem('usuarioLogueado')).email);
        this.movimientos = this.cargarMovimientos();

        // Evento para filtrar movimientos
        this.searchBar.addEventListener("input", (e) => {
            this.render(e.target.value);
        });

        this.render();
    }

    cargarMovimientos() {
        // Carga los movimientos desde localStorage o usa valores iniciales
        const movimientosData = this.user.transacciones || [];
        return movimientosData;
    }

    guardarMovimientos() {
        localStorage.setItem("movimientos", JSON.stringify(this.movimientos));
    }

    agruparPorFecha(movimientos) {
        return movimientos.reduce((acumulador, movimiento) => {
            if (!acumulador[movimiento.fecha]) {
                acumulador[movimiento.fecha] = [];
            }
            acumulador[movimiento.fecha].push(movimiento);
            return acumulador;
        }, {});
    }

    render(filter = "") {
        this.container.innerHTML = "";

        const movimientosFiltrados = this.movimientos.filter((movimiento) =>
            movimiento.mensaje.toLowerCase().includes(filter.toLowerCase())
        );

        const movimientosPorFecha = this.agruparPorFecha(movimientosFiltrados);

        Object.keys(movimientosPorFecha).forEach((fecha) => {
            const diaDiv = this.crearDiaMovimientos(fecha, movimientosPorFecha[fecha]);
            this.container.appendChild(diaDiv);
        });
    }

    crearDiaMovimientos(fecha, transacciones) {
        const diaDiv = document.createElement("div");
        diaDiv.classList.add("movimientos-dia");

        const diaTitulo = document.createElement("h3");
        diaTitulo.textContent = fecha;
        diaDiv.appendChild(diaTitulo);

        transacciones.forEach((movimiento) => {
            const movimientoDiv = document.createElement("div");
            movimientoDiv.classList.add("movimiento");

            const descripcionSpan = document.createElement("span");
            descripcionSpan.classList.add("movimiento-descripcion");
            descripcionSpan.textContent = `${movimiento.mensaje} (${movimiento.numeroCuenta})`;

            const montoSpan = document.createElement("span");
            montoSpan.classList.add("movimiento-monto");
            montoSpan.classList.add(movimiento.monto >= 0 ? "positivo" : "negativo");
            montoSpan.textContent = `$${Math.abs(movimiento.monto).toLocaleString()}.00`;

            movimientoDiv.appendChild(descripcionSpan);
            movimientoDiv.appendChild(montoSpan);
            diaDiv.appendChild(movimientoDiv);
        });

        return diaDiv;
    }
}

// Inicializar la aplicación
const app = new MovimientosApp("movimientos-container", "search-bar");

