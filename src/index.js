const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { generateMessage, generateNotification } = require("./utilities/message");
const { addUser, removeUser, getUser, getUserInRoom } = require("./utilities/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on("connection", (socket) => {

    socket.on("join", ({ username, room }, callback) => {
        const { error, user } =  addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit("notification", generateNotification(`Welcome, ${user.username}`));
        io.to(user.room).emit("sideBar", getUserInRoom(user.room));
        socket.broadcast.to(user.room).emit("notification", generateNotification(`${user.username} has joint.`));
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("message", generateMessage({ ...message, username: user.username }));
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("notification", generateNotification(`${user.username} has left.`));
            io.to(user.room).emit("sideBar", getUserInRoom(user.room));
        }
    })
})



server.listen(port, () => {
    console.log("Server is up at port: " + port);
})