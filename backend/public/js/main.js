const theme = document.querySelector('#theme');

// at every reload
window.onload = () => {
    document.body.className = localStorage.preferredMode;
    theme.innerText = localStorage.icon === undefined ? "🌞" : localStorage.icon;
}

// theme change
theme.addEventListener('click', () => {
    theme.classList.toggle('theme');
    if (theme.classList.contains('theme')) {
        theme.innerText = '🌛';
        document.body.classList.add('dark');
        // local storage
        localStorage.icon = '🌛'
        localStorage.preferredMode = "dark";
    } else {
        theme.innerText = '🌞';
        document.body.classList.remove('dark');
        // local storage
        localStorage.icon = '🌞'
        localStorage.preferredMode = "";
    }

})