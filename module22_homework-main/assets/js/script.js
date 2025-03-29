const links = document.querySelectorAll('.task__header');

links.forEach( (link) => {
    link.onclick = (event) => {
        event.currentTarget.querySelector('a').click();
    }
});