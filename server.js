const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {

    console.log("接続:", socket.id);

    socket.on("createRoom", () => {

        const roomCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        rooms[roomCode] = {
            players: []
        };

        rooms[roomCode].players.push(socket.id);

        socket.join(roomCode);

        socket.emit("roomCreated", roomCode);

        console.log("ルーム作成:", roomCode);

    });

    socket.on("joinRoom", (roomCode) => {

        if (!rooms[roomCode]) return;

        rooms[roomCode].players.push(socket.id);

        socket.join(roomCode);

        io.to(roomCode).emit("playerJoined");

        console.log("ルーム参加:", roomCode);

    });

    socket.on("disconnect", () => {

        console.log("切断:", socket.id);

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

    console.log("サーバー起動:", PORT);

});