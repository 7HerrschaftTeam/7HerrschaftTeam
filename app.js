// app.js

let currentPlayer = null;
let players = JSON.parse(localStorage.getItem('players')) || {};
let provincesState = {};

// Anmeldung
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const profilePic = document.getElementById('profile-pic').files[0];

    const reader = new FileReader();
    reader.onloadend = function () {
        const imgSrc = reader.result;
        players[name] = { name, imgSrc };
        currentPlayer = players[name];
        localStorage.setItem('players', JSON.stringify(players));
        loadMap();
    };
    reader.readAsDataURL(profilePic);
});

// Weltkarte laden
function loadMap() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('map-container').style.display = 'block';

    const map = document.getElementById('world-map');
    map.addEventListener('load', function () {
        const svgDoc = map.contentDocument;
        const provinces = svgDoc.querySelectorAll('path');

        provinces.forEach(province => {
            province.style.stroke = 'black';
            province.style.cursor = 'pointer';

            // Klick-Event für Provinzen
            province.addEventListener('click', function () {
                if (currentPlayer) {
                    const color = prompt("Färbe die Provinz: Rot für Angriff, Blau für Verteidigung, Orange für Bewegung").toLowerCase();
                    let fillColor;
                    if (color === 'rot') fillColor = 'red';
                    else if (color === 'blau') fillColor = 'blue';
                    else if (color === 'orange') fillColor = 'orange';

                    if (fillColor) {
                        province.style.fill = fillColor;
                        saveMove(province.id, fillColor);
                    }
                }
            });
        });
    });
}

// Zug speichern
function saveMove(provinceId, color) {
    fetch('http://localhost:3000/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: currentPlayer.name, provinceId, color })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Zug gespeichert!');
        } else {
            alert(data.error);
        }
    });
}

// Admin Login
document.getElementById('admin-login').addEventListener('click', function () {
    const password = document.getElementById('admin-password').value;
    if (password === 'Graf2024') {
        document.getElementById('admin-tools').style.display = 'block';
        loadAdminTools();
    } else {
        alert('Falsches Passwort');
    }
});

// Admin-Tools laden
function loadAdminTools() {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';

    Object.keys(players).forEach(playerName => {
        const playerDiv = document.createElement('div');
        playerDiv.innerText = playerName;
        playerDiv.style.cursor = 'pointer';

        playerDiv.addEventListener('click', function () {
            currentPlayer = players[playerName];
            alert(`${playerName} ist jetzt am Zug!`);
        });

        playerList.appendChild(playerDiv);
    });
}