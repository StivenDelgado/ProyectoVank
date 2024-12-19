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
    if (!localStorage.getItem('usuarioLogueado')) {
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
    this.mensajes = JSON.parse(localStorage.getItem('usuarios'))?.find(e => e.email === JSON.parse(localStorage.getItem('usuarioLogueado')).email).mensajes;
    this.mensajes.forEach(mensaje => {
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

  createMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(type);
    messageElement.innerHTML = message;

    return messageElement;
  }

  async chatBot(prompt) {
    const API_KEY = 'AIzaSyAB9sO0o40p65-3cuw8skZo7jamZW-cm9s';
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    console.log(JSON.stringify(this.bolsillos));
    return fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Eres un asistente financiero inteligente. Tu misión es analizar la situación financiera de un usuario y proporcionarle **consejos específicos** sobre cómo manejar sus deudas, distribuir su capital disponible, y mejorar sus finanzas personales.
                      También debes responder preguntas generales o saludar de manera adecuada si el mensaje del usuario no tiene relación directa con finanzas.

                      ### Información de entrada del usuario:
                      1. **Capital disponible**: ${2500000}
                      2. **Arreglo de deudas**:
                        - Cada deuda contiene:
                        - Nombre de la deuda
                        - Monto total
                        Estas son las deudas: ${JSON.stringify(this.bolsillos)}
                      3. **Historial del chat**: ${JSON.stringify(this.mensajes)}

                      ### Mensaje del usuario:
                      "${prompt}"

                      ### Instrucciones:
                      - Si el mensaje del usuario es un saludo o una pregunta no relacionada con finanzas, responde de manera educada y directa, sin análisis financiero.
                      - Si el mensaje está relacionado con finanzas (por ejemplo, menciona deudas, dinero, ahorros, etc.), analiza el estado financiero proporcionado y da consejos claros y útiles.
                      - Responde siempre de manera amigable y profesional.`
            }
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