const http = require("http").createServer();

var players = [];

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  players.push(`${socket.id.substr(0, 2)}`);
  
  console.log("Un nouveau joueur s'est connecté");

  socket.on("message", (message) => {
    console.log(message)
    io.emit("message", `${socket.id.substr(0, 2)} à dit ${message}`);
  });
});


http.listen(8080, () => console.log("Serveur actif sur le port 8080"));
