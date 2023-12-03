// Importar el módulo dotenv e inicializar las variables de entorno desde el archivo .env
require("dotenv").config();

const http = require("http");

function requestController() {
    console.log('Console Log Funcion con la Logica');
}

// Configurar el servidor
const server = http.createServer(requestController);

// Obtener el puerto de las variables de entorno o utilizar el puerto 4000 por defecto
const PORT = process.env.PORT || 4000;

server.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
