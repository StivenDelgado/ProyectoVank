class BolsillosApp {
    constructor() {
        //comprobar si el usuario esta logeado
        if (!localStorage.getItem('usuarioLogueado')) {
            alert('Debes estar logeado para poder ver tus bolsillos');
            window.location.href = 'login.html';
            return
        }
        this.currentPocket = null;
        this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        this.usuario = JSON.parse(localStorage.getItem("usuarioLogueado")) || {};
        this.objUser = this.usuarios.find((u) => u.email === this.usuario.email)
        this.pockets = this.objUser.bolsillos || [];
        // Elementos del DOM
        this.addPocketBtn = document.getElementById("add-pocket-btn");
        this.pocketForm = document.getElementById("pocket-form");
        this.pocketList = document.getElementById("pocket-list");
        this.pocketDetails = document.getElementById("pocket-details");
        this.renderBolsillos()
        // Inicializar eventos
        this.initEvents();
    }

    initEvents() {
        // Evento para mostrar/ocultar formulario
        this.addPocketBtn.addEventListener("click", () => this.toggleForm());

        // Evento para crear un bolsillo
        this.pocketForm.addEventListener("submit", (e) => this.agregarBolsillo(e));

        // Evento para agregar monto al bolsillo
        document.getElementById("add-amount-btn").addEventListener("click", () => this.agregarMonto());
        // Evento para quitar monto del bolsillo
        document.getElementById("remove-amount-btn").addEventListener("click", () => this.quitarMonto());
    }


    toggleForm() {
        this.pocketForm.classList.toggle("hidden");
        this.pocketDetails.classList.add("hidden");
    }

    agregarBolsillo(e) {
        e.preventDefault();
        const name = document.getElementById("new-pocket-name").value;
        const total = parseFloat(document.getElementById("new-pocket-total").value);

        if (name && total > 0) {
            const newPocket = { name, total, current: 0 };
            this.pockets.push(newPocket);
            this.objUser['bolsillos'] = this.pockets;
            let index = this.usuarios.findIndex((u) => u.email === this.usuario.email);
            this.usuarios[index] = this.objUser;
            localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
            this.renderBolsillos();
            this.pocketForm.reset();
            this.pocketForm.classList.add("hidden");
        } else {
            alert("Por favor, ingresa un nombre y un monto válido.");
        }
    }

    renderBolsillos() {
        this.pocketList.innerHTML = "";
        this.pockets.forEach((pocket, index) => {
            const li = document.createElement("li");
            li.textContent = `${pocket.name} - $${pocket.current} / $${pocket.total}`;
            li.addEventListener("click", () => this.mostrarDetallesBolsillos(index));
            this.pocketList.appendChild(li);
        });
    }

    mostrarDetallesBolsillos(index) {
        this.currentPocket = index;
        const pocket = this.pockets[index];

        document.getElementById("pocket-name").textContent = pocket.name;
        document.getElementById("pocket-amount").textContent = `Progreso: $${pocket.current} / $${pocket.total}`;
        document.querySelector(".progress").style.width = `${(pocket.current / pocket.total) * 100}%`;

        this.pocketDetails.classList.remove("hidden");
        this.pocketForm.classList.add("hidden");
    }


    agregarMonto() {
        const amount = parseFloat(prompt("¿Cuánto quieres agregar?"));

        if (!isNaN(amount) && amount > 0) {
            const pocket = this.pockets[this.currentPocket];
            pocket.current += amount;

            if (pocket.current >= pocket.total) {
                pocket.current = pocket.total;
                alert("🎉 ¡Bolsillo completado!");
            }
            let index = this.usuarios.findIndex((u) => u.email === this.usuario.email);
            this.objUser.bolsillos[this.currentPocket] = pocket;
            this.usuarios[index] = this.objUser;
            localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
            this.renderBolsillos();
            this.mostrarDetallesBolsillos(this.currentPocket);
        } else {
            alert("Ingresa un monto válido.");
        }
    }

    quitarMonto() {
        const amount = parseFloat(prompt("¿Cuánto quieres quitar?"));

        if (!isNaN(amount) && amount > 0) {
            const pocket = this.pockets[this.currentPocket];

            if (amount > pocket.current) {
                alert("El monto a quitar no puede ser mayor al monto actual del bolsillo.");
                return;
            }

            pocket.current -= amount;

            let index = this.usuarios.findIndex((u) => u.email === this.usuario.email);
            this.objUser.bolsillos[this.currentPocket] = pocket;
            this.usuarios[index] = this.objUser;
            localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
            this.renderBolsillos();
            this.mostrarDetallesBolsillos(this.currentPocket);
        } else {
            alert("Ingresa un monto válido.");
        }
    }
}
new BolsillosApp();

