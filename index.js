require("dotenv").config();
const axios = require("axios");

// Variable para almacenar la suma de números aleatorios
let randomSum = 0;
let datos = {};

function updateRandomSum() {
    // Generar dos números aleatorios entre 1 y 1000
    const randomNumber1 = Math.floor(Math.random() * 1000) + 1;
    const randomNumber2 = Math.floor(Math.random() * 1000) + 1;

    // Sumar los números aleatorios y asignar el resultado a la variable
    randomSum = randomNumber1 + randomNumber2;

    // Mostrar el valor actualizado en la consola
    console.log("Valor actualizado de randomSum:", randomSum);
}

// Actualizar la variable cada 10 segundos (10000 milisegundos)
setInterval(updateRandomSum, 50000);

async function requestController(req, res) {
    const apiKeyGet = "R7ER64vfNYTruLXlvYw9FpFLyi0FJRUujYSp0HRP"; // API key para la solicitud GET
    const apiKeyPost = "Iu9soxDtZGLi3HCDqAM8oyNdPI6if53hOjXgKSMe"; // API key para la solicitud POST

    try {
        // Realizar la solicitud GET a la URL proporcionada
        const response = await axios.get("https://app.stelorder.com/app/products", {
            headers: {
                "APIKEY": apiKeyGet,
            },
        });

        // Obtener los datos de la respuesta
        const responseData = response.data;

        // Mapear los datos según el formato deseado
        const formattedData = responseData.map(item => {
            return {
                "description": item.description,
                "purchase-price": item["purchase-price"],
                "serial-number-id": item["serial-number-id"],
                "name": item.name,
                "sales-price": item["sales-price"]
            };
        });

        // Crear un nuevo objeto con el aumento del 25% en el precio de venta
        const updatedSalesData = formattedData.map(item => {
            return {
                "description": item.description,
                "name": item.name,
                "sales-price": item["sales-price"] * 1.25
            };
        });

        // Imprimir los datos formateados con el nuevo precio de venta
        console.log(updatedSalesData);
        datos = {
            name: "TES7777777777777"

        }
        // Enviar los datos actualizados a la nueva API usando la API key correspondiente
        await sendToStelOrderAPI("https://app.stelorder.com/app/products", apiKeyPost, datos);

        // Responder con los datos formateados
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(updatedSalesData));
    } catch (error) {
        // Manejar errores al realizar la solicitud
        console.error("Error al hacer la solicitud:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error interno del servidor");
    }
}

// Función para enviar datos a la nueva API
async function sendToStelOrderAPI(apiUrl, apiKey, datos) {
    try {
        // Realizar solicitudes POST a la API con los datos formateados en el cuerpo (body)
        const response = await axios.post(apiUrl, datos, {
            headers: {
                "APIKEY": apiKey,
                "Content-Type": "application/json",
            },
        });

        console.log("Respuesta de la API de StelOrder:", response.data);
    } catch (error) {
        console.error("Error al enviar datos a la API de StelOrder:", error);
    }
}

// Configurar el servidor
const server = require("http").createServer(requestController);

// Obtener el puerto de las variables de entorno o utilizar el puerto 4000 por defecto
const PORT = process.env.PORT || 4000;

server.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
