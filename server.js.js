const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9999 });

const clients = [];

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        broadcast(String(message));
    });

    ws.send('Bienvenue dans le chat!');
});

function broadcast(message) {
    clients.forEach(function(client) {
        client.send(message);
    });
}

console.log('Server started on port 9999');
const express = require("express");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/send-message", upload.single("image"), (req, res) => {

    let imageUrl = null;

    if (req.file) {
        imageUrl = "/uploads/" + req.file.filename;
    }

    res.json({
        success: true,
        imageUrl
    });
});

app.listen(3000, () => {
    console.log("Serveur lancé");
});
