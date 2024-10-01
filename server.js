// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let players = {}; // Spieler speichern
let provincesState = {}; // Provinzen speichern

// Route zum Verarbeiten von Spieleraktionen
app.post('/move', (req, res) => {
    const { playerName, provinceId, color } = req.body;

    // Überprüfen, ob der Spieler existiert und Zugrechte hat
    if (players[playerName]) {
        provincesState[provinceId] = { color, player: playerName };
        res.status(200).send({ success: true });
    } else {
        res.status(403).send({ error: 'Ungültiger Zug!' });
    }
});

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});