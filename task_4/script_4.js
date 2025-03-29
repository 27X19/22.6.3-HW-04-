document.addEventListener('DOMContentLoaded', () => {
    // Функция для обработки клика
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }
  
    // Привязываем обработчик события к кнопке с классом .sample__button
    onclick('.sample__button', () => act_fetch());
});

const waiting_message = document.querySelector('.waiting__message');
const response_container = document.querySelector('#response_container');
const ul = document.querySelector('.response__list');

function act_fetch() {
    hideResponse();  

    clearResponse();  


    if ("geolocation" in navigator && navigator.geolocation) {
        showWaiting(`Определение местоположения...`);

        // Получаем текущее местоположение
        navigator.geolocation.getCurrentPosition(geo_success, geo_error);
    } else {
        addItem('Браузер не поддерживает определение местоположения');
    }

    showResponse();  
}

function geo_success(position) {
    const { coords } = position;
    
    // Формируем URL для API запроса о временной зоне
    const url = `https://api.ipgeolocation.io/timezone?apiKey=32bcd4a6e4b548968e7afcdb682ac679&lat=${coords.latitude}&long=${coords.longitude}`;

    showWaiting(`Запрос к TimezoneAPI...`);

    // Выполняем запрос к API
    fetch(url)
        .then(response => response.json())  // Преобразуем ответ в JSON
        .then(data => {
            hideWaiting();  // Скрываем сообщение ожидания

            addItem(`Временная зона: ${data.timezone}`);
            addItem(`Местная дата и время: ${data.date_time_txt}`);
        })
        .catch(err => {
            hideWaiting();  
            addItem('Ошибка при запросе временной зоны');
        });
}

function geo_error() {
    addItem('Информация о местоположении недоступна');
}

// Функция для очистки списка с ответами
function clearResponse() {
    while (ul.firstChild) {
        ul.removeChild(ul.lastChild);
    }
}

// Функция для добавления элемента в список
function addItem(text) {
    const li = document.createElement("li");
    li.innerText = text;
    ul.appendChild(li);
}

function hideResponse() {
    response_container.classList.add('page__content--hidden');
}

function showResponse() {
    response_container.classList.remove('page__content--hidden');
}

function showWaiting(message) {
    waiting_message.innerHTML = message;
    waiting_message.classList.remove('waiting__message--hidden');
}

function hideWaiting() {
    waiting_message.classList.add('waiting__message--hidden');
}
