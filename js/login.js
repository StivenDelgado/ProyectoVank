class Login{
    /**
     * Método que verifica si las credenciales coinciden con un usuario existente.
     */
    login(email, password){
        const users = JSON.parse(localStorage.getItem('usuarios')) || [];  //Se obtiene los usuarios almacenados.
        const user = users.find(user => user.email === email && user.password === password);    //Busca el usuario que coincida con los datos recibidos.
    
        //Si los datos coinciden guarda el usuario en localStorage.
        if(user){
            localStorage.setItem('usuarioLogueado', JSON.stringify(user));
            localStorage.setItem("username", user.nombre); //Guarda el nombre para el saludo
            return true;
        }
        return false;
    }

    /**
     * Método que devuelve el usuario que esta logueado, desde el localStorage
     */
    static cargarUsuarioLogueado(){
        return JSON.parse(localStorage.getItem('usuarioLogueado'));
    }

    /**
     * Método que elimina el usuario del localStorage para simular cerrar sesión.
     */
     cerrarSesion(){
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('username');
    }
}

const login = new Login();

const loginForm = document.getElementById('container-form');
const messageDiv = document.getElementById('message');

loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    //Obtener los datos que el usuario ingresa
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Iniciar sesión
    if(login.login(email,password)){
        messageDiv.textContent = `Bienvenido ${email}`;
        messageDiv.style.color = 'green';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else{
        messageDiv.textContent = `Email o contraseña incorrectos.`
        messageDiv.style.color = 'red';
    }
});