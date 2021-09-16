const http = require("http");

const server = http.createServer((req, res)=>{
  res.end("Server is created");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, console.log('Server started on port '+PORT));
