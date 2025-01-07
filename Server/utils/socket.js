const socketIo = require("socket.io");

const io = socketIo({
  cors: {
    origin: "*", // Sesuaikan dengan origin yang diizinkan
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

module.exports = io;
