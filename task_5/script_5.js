document.addEventListener('DOMContentLoaded', () => {
    // Обработчики событий для кнопок
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }

    onclick('#btn_send_message', () => act_send_message());
    onclick('#btn_send_geo', () => act_send_geo());

    // Очистка чата при загрузке
    clearChat();
});

const wsUri = "wss://echo-ws-service.herokuapp.com/";

let socket = null;
let geoSended = false;

const chat_content = document.querySelector('.chat__content');
const chat_input = document.querySelector('.chat__input');

// Отправка сообщения при нажатии на клавишу Enter
chat_input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        act_send_message();
    }
});

// Функция для отправки сообщения
async function act_send_message() {
    const text = chat_input.value ? chat_input.value : "Пример сообщения";
    
    await ensureSocket();  // Проверяем соединение WebSocket

    socket.send(text);  // Отправляем сообщение
    addSended(text);  // Добавляем сообщение в чат
}

// Функция для отправки геолокации
async function act_send_geo() {
    await ensureSocket();  // Проверяем соединение WebSocket

    if ("geolocation" in navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geoSended = true;
                socket.send([position.coords.latitude, position.coords.longitude]);
                addGeo(position);  // Добавляем информацию о геолокации в чат
            },
            () => {
                addInfo('Информация о местоположении недоступна');
            }
        );        
    } else {
        addInfo('Браузер не поддерживает определение местоположения');
    }
}

// Функция для создания WebSocket соединения
async function ensureSocket() {
    if (!socket) {
        socket = new WebSocket(wsUri);

        const connection_resolvers = [];
        const checkConnection = () => {
            return new Promise((resolve, reject) => {
                if (socket.readyState === WebSocket.OPEN) {
                    resolve();
                } else {
                    connection_resolvers.push({ resolve, reject });
                }
            });
        };

        socket.onopen = () => { 
            connection_resolvers.forEach(r => r.resolve());
            addInfo(`Установлено соединение с ${socket.url}`); 
        };

        socket.onclose = () => { 
            addInfo('Соединение закрыто'); 
            socket = null;
        };

        socket.onmessage = (evt) => { addReceived(evt.data); };
        socket.onerror = (evt) => { addInfo(evt.data); };

        await checkConnection();
    }
}


function removeChilds(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    };
}

// Очистка чата
function clearChat() {
    removeChilds(chat_content);
}


function addItem(text, classNames = []) {
    const div = document.createElement("div");
    div.textContent = text;

    classNames.forEach(element => {
        div.classList.add(element);
    });

    chat_content.prepend(div);
    showChat();
}

// Добавление ссылки в чат
function addLink(url, text, classNames = []) {
    const a = document.createElement("a");
    a.text = text;
    a.href = url;
    a.target = '_blank';

    classNames.forEach(element => {
        a.classList.add(element);
    });

    chat_content.prepend(a);
    showChat();
}

// Скрытие чата
function hideChat() {
    chat_content.classList.add('chat__content--hidden');
}

// Показ чата
function showChat() {
    chat_content.classList.remove('chat__content--hidden');
}

// Добавление информационного сообщения
function addInfo(text) {
    addItem(text, ['chat__info']);
}

// Добавление отправленного сообщения
function addSended(text) {
    addItem(text, ['chat__message', 'chat__message--sended']);
}

// Добавление информации о геолокации
function addGeo(position) {
    const { coords } = position;
    const text = `Широта: ${coords.latitude} °, долгота: ${coords.longitude} °`;
    const url = `https://www.openstreetmap.org?mlat=${coords.latitude}&mlon=${coords.longitude}`;

    addLink(url, text, ['chat__message', 'chat__message--geo', 'chat__link']);
}

// Добавление полученного сообщения
function addReceived(text) {
    if (!geoSended) {
        addItem(text, ['chat__message', 'chat__message--received']);
    }

    geoSended = false;
}
