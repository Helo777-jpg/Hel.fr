const WebSocket = require('ws');
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();



// =======================
// WEBSOCKET
// =======================

const wss = new WebSocket.Server({ port: 9999 });

const clients = [];

wss.on('connection', (ws) => {

    clients.push(ws);

    ws.send(JSON.stringify({
        type: "system",
        message: "Bienvenue dans le chat!"
    }));

    ws.on('message', (message) => {

        console.log("Message reçu :", message.toString());

        broadcast({
            type: "text",
            message: message.toString()
        });
    });

    ws.on('close', () => {
        const index = clients.indexOf(ws);

        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

function broadcast(data) {

    clients.forEach(client => {

        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}



// =======================
// UPLOAD IMAGE
// =======================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        const safeName = file.originalname.replace(
            /[^a-zA-Z0-9.\-_]/g,
            "_"
        );

        cb(null, Date.now() + "-" + safeName);
    }
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/send-message", upload.single("image"), (req, res) => {

    let imageUrl = null;

    if (req.file) {
        imageUrl = "http://localhost:3000/uploads/" + req.file.filename;
    }

    // envoyer l'image à tous les clients
    broadcast({
        type: "image",
        imageUrl: imageUrl
    });

    res.json({
        success: true,
        imageUrl
    });
});



// =======================
// LANCEMENT SERVEUR
// =======================

app.listen(3000, () => {
    console.log("Serveur Express lancé sur 3000");
});

console.log("WebSocket lancé sur 9999");
