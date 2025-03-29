document.addEventListener('DOMContentLoaded', () => {
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }

    onclick('.sample__button', () => act_fetch());
});

const waiting_message = document.querySelector('.waiting__message');
const response_container = document.querySelector('#response_container');
const ul = document.querySelector('.response__list');

function act_fetch() {
    hideResponse();
    clearResponse();
    addItem(`Размер экрана - ширина: ${window.screen.width} px, высота: ${window.screen.height} px`);

    if ("geolocation" in navigator && navigator.geolocation) {
        showWaiting('Определение местоположения...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                hideWaiting();
                const { coords } = position;
                addItem(`Местоположение - широта: ${coords.latitude} °, долгота: ${coords.longitude} °`);
            },
            () => {
                hideWaiting();
                addItem('Информация о местоположении недоступна');
            }
        );
    } else {
        addItem('Браузер не поддерживает определение местоположения');
    }

    showResponse();
}

function clearResponse() {
    while (ul.firstChild) {
        ul.removeChild(ul.lastChild);
    }
}

function addItem(text) {
    const li = document.createElement("li");
    li.innerText = text;
    ul.appendChild(li);
}

function removeLastItem() {
    if (ul.firstChild) {
        ul.removeChild(ul.lastChild);
    }
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
