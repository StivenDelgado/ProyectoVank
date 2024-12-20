//verifica que existe un usuario en localStore
document.addEventListener("DOMContentLoaded", () =>{
    const usuario = localStorage.getItem("username");

    //Se obtiene el elemento del saludo
    const saludo = document.querySelector("main section h3");

    if(usuario){
        //muestra el saludo con el nombre
        saludo.textContent=`Hola, ${usuario}`;
    }
});