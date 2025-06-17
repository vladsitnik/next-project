const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

let active = 0;

io.on("connection", (socket) => {
  active++;
  io.emit("active_sessions", active);

  socket.on("disconnect", () => {
    active--;
    io.emit("active_sessions", active);
  });

  socket.on("new_session", () => {
  });
});