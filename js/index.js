//verifica que existe un usuario en localStore
document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem('usuarioLogueado')) {
        alert('Debes estar logeado navegar en la página');
        window.location.href = 'login.html';
        return
    }
    const usuario = localStorage.getItem("username");

    //Se obtiene el elemento del saludo
    const saludo = document.querySelector("main section h3");

    if (usuario) {
        //muestra el saludo con el nombre
        saludo.innerHTML = `Hola, <strong>${usuario}</strong>. <br> Tu saldo es de <span style="color: green;">2.500.000 COP</span>.`;
    }
});