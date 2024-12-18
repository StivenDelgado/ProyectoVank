class ChatBot {
    constructor() {
        this.chatBox = document.querySelector('.chat-box');
        this.chatInput = document.querySelector('.chat-input');
        this.messageUser = document.querySelector('.user-message');
        this.messageBot = document.querySelector('.bot-message');
        this.users = JSON.parse(localStorage.getItem('usuarios'));
        this.user = this.users.find(e => e.email === JSON.parse(localStorage.getItem('usuarioLogueado')).email);
        this.bolsillos = this.user.bolsillos;
        
        //comprobar si el usuario esta logeado
        if(!localStorage.getItem('usuarioLogueado')){
            alert('Debes estar logeado para poder chatear con el bot');
            window.location.href = 'login.html';
        }

        //Enter en el teclado
        this.chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.handleSubmit();
            }
        });
        // persistencia de mensajes
        let mensajes = JSON.parse(localStorage.getItem('usuarios'))?.find(e => e.email === JSON.parse(localStorage.getItem('usuarioLogueado')).email).mensajes;
        mensajes.forEach(mensaje => {
            this.chatBox.appendChild(this.createMessage(mensaje.mensaje, mensaje.rol === 'bot' ? 'bot-message' : 'user-message'));
        });
        this.scrollToBottom()
    }

    async handleSubmit() {
        const messageUser = this.chatInput.querySelector('input').value;
        this.chatInput.querySelector('input').value = '';

        if (messageUser) {
            this.chatBox.appendChild(this.createMessage(messageUser, 'user-message'));
        }
        let messageIA = await this.chatBot(messageUser)
            this.chatBox.appendChild(this.createMessage(messageIA, 'bot-message')); 
        let messageIAObj = {
          rol: 'bot',
          mensaje: messageIA
        }
        let messageUserObj = {
          rol: 'usuario',
          mensaje: messageUser
        }

        this.user['mensajes'] = this.user['mensajes'] || [];
        this.user['mensajes'].push(messageUserObj);
        this.user['mensajes'].push(messageIAObj);

        let index = this.users.findIndex(e => e.email === this.user.email);
        this.users[index] = this.user;
        localStorage.setItem('usuarios', JSON.stringify(this.users));
        this.scrollToBottom()
    }

    createMessage(message,type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(type);
        messageElement.innerHTML = message;

        return messageElement;
    }

    async chatBot(prompt) {
        const API_KEY = 'AIzaSyAB9sO0o40p65-3cuw8skZo7jamZW-cm9s';
        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
      
        return fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: `${prompt}` }
              ]
            }]
          })
        })
        .then(respuesta => {
          if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
          }
          return respuesta.json();
        })
        .then(datos => {
          const textoGenerado = datos.candidates[0].content.parts[0].text;
          return textoGenerado;
        })
        .catch(error => {
          console.error('Error al llamar a la API de Gemini:', error);
        });
      }

    scrollToBottom() {
        const chatContainer = document.querySelector('.chat-box');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

const chatBot = new ChatBot();