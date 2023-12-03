require("dotenv").config();

const http = require("http");

function requestController() {
    console.log('Console Log Funcion con la Logica');

}

// Configurar el servidor
const server = http.createServer(requestController);

const PORT = process.env.PORT;

server.listen(400, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
})