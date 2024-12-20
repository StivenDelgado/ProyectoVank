class Register {
    constructor() {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", this.submitHandler.bind(this));
        this.usuarios = JSON.parse(localStorage.getItem("usuarios"));
    }

    submitHandler(event) {
        event.preventDefault();
        const objeto = new FormData(this.form);
        const usuario = Object.fromEntries(objeto.entries());
        
        if (usuario.password !== usuario.confirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }
        if (usuario.password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        
        if (localStorage.getItem("usuarios")) {
            const usuarios = JSON.parse(localStorage.getItem("usuarios"));
            if (usuarios.find(u => u.email === usuario.email)) {
                alert("El usuario ya existe");
                return;
            }
            usuarios.push(usuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("username", usuario.nombre);

        }else{
            const usuarios = [usuario];
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }
        alert("Registro exitoso");
        
        indow.location.href = "login.html";
    }

            
}

const register = new Register();