class ChatBot {
    constructor() {
        this.chatBox = document.querySelector('.chat-box');
        this.chatInput = document.querySelector('.chat-input');
        this.messageUser = document.querySelector('.user-message');
        this.messageBot = document.querySelector('.bot-message');
        //Enter en el teclado
        this.chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.handleSubmit();
            }
        });
    }

    async handleSubmit() {
        const message = this.chatInput.querySelector('input').value;
        this.chatInput.querySelector('input').value = '';

        if (message) {
            this.messageUser.textContent = message;
            this.chatBox.appendChild(this.createMessage(message, 'user'));
        }
        let respuesta = await this.chatBot(message)
            this.messageBot.textContent = respuesta;
            this.chatBox.appendChild(this.createMessage(respuesta, 'bot'));
    }

    createMessage(type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(type);

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
                { text: prompt }
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
          
          console.log(textoGenerado);
          return textoGenerado;
        })
        .catch(error => {
          console.error('Error al llamar a la API de Gemini:', error);
        });
      }
}

const chatBot = new ChatBot();