class Transaccion {
    constructor() {
        //comprobar si el usuario esta logeado
        if (!localStorage.getItem('usuarioLogueado')) {
            alert('Debes estar logeado para poder ver tus transacciones');
            window.location.href = 'login.html';
            return
        }
        this.enviarForm = document.getElementById("enviar-form");
        this.btnCancelar = document.getElementById("cancelar");
        this.messageDiv = document.getElementById("message");

        this.users = JSON.parse(localStorage.getItem('usuarios'));
        this.user = this.users.find(e => e.email === JSON.parse(localStorage.getItem('usuarioLogueado')).email);
        //Cargar transacciones desde localStorage
        this.transacciones = this.user.transacciones || [];

        //Inicializar eventos
        this.initEvents();
    }

    initEvents() {
        //Manejo de formulario
        this.enviarForm.addEventListener("submit", (e) => this.agregarTransacciones(e));

        //Boton cancelar
        this.btnCancelar.addEventListener("click", (e) => this.limpiarFormulario());
    }

    agregarTransacciones(e) {
        e.preventDefault();

        //Obtener datos del formulario
        const numeroCuenta = document.getElementById("cuenta").value;
        const monto = parseFloat(document.getElementById("monto").value);
        const mensaje = document.getElementById("mensaje").value;

        if (numeroCuenta && monto > 0) {
            //crear nueva transacción
            const nuevaTransaccion = {
                id: this.transacciones.length + 1,
                fecha: new Date().toLocaleDateString(),
                monto: monto,
                mensaje: mensaje,
                numeroCuenta: numeroCuenta,
            };

            //Guardar en la lista local
            this.transacciones.push(nuevaTransaccion);
            let index = this.users.findIndex(e => e.email === this.user.email);
            this.users[index].transacciones = this.transacciones;
            //Guardar en localStorage
            localStorage.setItem("usuarios", JSON.stringify(this.users));

            this.mostrarMensaje("Transacción exitosa", "success");

            //Limpiar formulario
            this.enviarForm.reset();
        } else {
            this.mostrarMensaje("Por favor complete todos los campos correctamente", "error");
        }
    }

    limpiarFormulario() {
        this.enviarForm.reset();  // Limpiar los campos del formulario
    }

    mostrarMensaje(texto, tipo) {
        const tiposClases = {
            success: "mensaje-exito",
            error: "mensaje-error",
        };
        // Aplicar texto y clase
        this.messageDiv.textContent = texto;
        this.messageDiv.className = tiposClases[tipo] || "mensaje-default";

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            this.messageDiv.textContent = "";
        }, 3000);
    }
}

const transaccion = new Transaccion();

