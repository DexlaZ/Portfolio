// Mettre à jour l'horloge
function updateClock() {
    const now = new Date();
    document.getElementById("clock").innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fonction pour rendre une fenêtre déplaçable
function makeDraggable(windowId) {
    const windowElement = document.getElementById(windowId);
    const header = windowElement.querySelector(".window-header");

    let offsetX = 0, offsetY = 0, isDragging = false;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
        windowElement.style.zIndex = getNextZIndex(); // Mettre au premier plan
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            const maxX = window.innerWidth - windowElement.clientWidth;
            const maxY = window.innerHeight - windowElement.clientHeight;

            x = Math.max(0, Math.min(maxX, x));
            y = Math.max(0, Math.min(maxY, y));

            windowElement.style.left = `${x}px`;
            windowElement.style.top = `${y}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

// Gestion du z-index pour les fenêtres
let zIndexCounter = 10;
function getNextZIndex() {
    return ++zIndexCounter;
}

// Ouvrir une fenêtre
function openWindow(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    win.style.display = "block";
    win.style.animation = "openWindow 0.3s ease-out";
    win.style.zIndex = getNextZIndex();
}

// Fermer une fenêtre
function closeWindow(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    win.style.animation = "closeWindow 0.2s ease-in";

    function hideWindow() {
        win.style.display = "none";
        win.removeEventListener("animationend", hideWindow);
    }

    win.addEventListener("animationend", hideWindow);
}

// Fonction pour minimiser une fenêtre et afficher son icône dans la barre des tâches
function minimizeWindow(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    const taskbarIcons = document.getElementById('taskbar-icons');

    // Cacher la fenêtre
    win.style.display = "none";

    // Créer l'icône de la fenêtre dans la barre des tâches
    const taskbarIcon = document.createElement('div');
    taskbarIcon.classList.add('taskbar-icon');
    taskbarIcon.innerHTML = `<img src="assets/icons/${windowName}.png" alt="${windowName}">`;

    // Ajouter l'icône dans la barre des tâches
    taskbarIcons.appendChild(taskbarIcon);

    // Cliquer sur l'icône pour restaurer la fenêtre
    taskbarIcon.addEventListener("click", () => restoreWindow(windowName, taskbarIcon));
}

// Restaurer une fenêtre depuis la barre des tâches
function restoreWindow(windowName, taskbarIcon) {
    const win = document.getElementById(`window-${windowName}`);
    win.style.display = "block"; // Afficher la fenêtre
    taskbarIcon.remove(); // Supprimer l'icône de la barre des tâches
}

// Fonction pour maximiser/restaurer la fenêtre
function toggleMaximize(windowName) {
    const win = document.getElementById(`window-${windowName}`);
    
    if (win.classList.contains('maximized')) {
        // Si la fenêtre est déjà maximisée, on la remet normale
        win.classList.remove('maximized');
        win.style.left = win.dataset.oldLeft;
        win.style.top = win.dataset.oldTop;
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
    } else {
        // Sinon on sauvegarde la position et taille actuelle
        win.dataset.oldLeft = win.style.left;
        win.dataset.oldTop = win.style.top;
        win.dataset.oldWidth = win.style.width;
        win.dataset.oldHeight = win.style.height;

        // Puis on met plein écran
        win.classList.add('maximized');
        win.style.left = "0";
        win.style.top = "0";
        win.style.width = "100vw";
        win.style.height = "100vh";
    }
}

// Exécution au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    ["window-about", "window-projects", "window-contact", "window-compétences"].forEach(makeDraggable);
    updateClock();
    setInterval(updateClock, 1000);
});

// Ouvrir/fermer le menu démarrer
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('open'); // Ajoute ou enlève la classe 'open'
}
