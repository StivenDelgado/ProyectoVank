const addPocketBtn = document.getElementById("add-pocket-btn");
const pocketForm = document.getElementById("pocket-form");
const pocketList = document.getElementById("pocket-list");
const pocketDetails = document.getElementById("pocket-details");

let pockets = []; // Array que guarda todos los bolsillos
let currentPocket = null;

// Mostrar formulario
addPocketBtn.addEventListener("click", () => {
    pocketForm.classList.toggle("hidden");
    pocketDetails.classList.add("hidden");
});

// Crear un nuevo bolsillo
pocketForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("new-pocket-name").value;
    const total = parseFloat(document.getElementById("new-pocket-total").value);

    const newPocket = { name, total, current: 0 };
    pockets.push(newPocket);
    renderPockets();
    pocketForm.reset();
    pocketForm.classList.add("hidden");
});

// Renderizar la lista de bolsillos
function renderPockets() {
    pocketList.innerHTML = "";
    pockets.forEach((pocket, index) => {
        const li = document.createElement("li");
        li.textContent = `${pocket.name} - $${pocket.current} / $${pocket.total}`;
        li.addEventListener("click", () => showPocketDetails(index));
        pocketList.appendChild(li);
    });
}

// Mostrar detalles de un bolsillo
function showPocketDetails(index) {
    currentPocket = index;
    const pocket = pockets[index];

    document.getElementById("pocket-name").textContent = pocket.name;
    document.getElementById("pocket-amount").textContent = `Progreso: $${pocket.current} / $${pocket.total}`;
    document.querySelector(".progress").style.width = `${(pocket.current / pocket.total) * 100}%`;

    pocketDetails.classList.remove("hidden");
    pocketForm.classList.add("hidden");
}

// Agregar monto al bolsillo
document.getElementById("add-amount-btn").addEventListener("click", () => {
    const amount = parseFloat(prompt("¿Cuánto quieres agregar?"));
    if (!isNaN(amount) && amount > 0) {
        const pocket = pockets[currentPocket];
        pocket.current += amount;

        if (pocket.current >= pocket.total) {
            pocket.current = pocket.total;
            alert("🎉 ¡Bolsillo completado!");
        }
        renderPockets();
        showPocketDetails(currentPocket);
    }
});
