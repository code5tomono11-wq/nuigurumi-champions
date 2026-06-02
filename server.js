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

        const code =
            Math.floor(100000 + Math.random() * 900000)
            .toString();

        rooms[code] = {
            players: [socket.id]
        };

        socket.join(code);

        socket.emit("roomCreated", code);

        console.log("ルーム作成:", code);
    });

    socket.on("joinRoom", (code) => {

        if (!rooms[code]) {
            socket.emit(
                "errorMessage",
                "ルームが存在しません"
            );
            return;
        }

        rooms[code].players.push(socket.id);

        socket.join(code);

        io.to(code).emit("battleReady");

        console.log("ルーム参加:", code);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("サーバー起動:", PORT);
});