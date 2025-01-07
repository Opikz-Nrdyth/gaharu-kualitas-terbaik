require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectToDatabase } = require("./config/database");
const io = require("./utils/socket");

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
io.listen(server);

async function startServer() {
  try {
    await connectToDatabase();

    const customToSocketId = new Map();
    io.on("connection", (socket) => {
      const userID = socket.handshake.query.myID;
      console.log("User Connected:", userID);

      customToSocketId.set(userID, socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", userID);
        customToSocketId.delete(userID);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
