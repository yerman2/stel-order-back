require("dotenv").config();
const axios = require("axios");

// Variable para almacenar la suma de números aleatorios
let randomSum = 0;
let datos = {};
let peticionesRealizadas = false; // Variable de control

function updateRandomSum() {
    // Generar dos números aleatorios entre 1 y 1000
    const randomNumber1 = Math.floor(Math.random() * 1000) + 1;
    const randomNumber2 = Math.floor(Math.random() * 1000) + 1;

    // Sumar los números aleatorios y asignar el resultado a la variable
    randomSum = randomNumber1 + randomNumber2;

    // Mostrar el valor actualizado en la consola
    console.log("Valor actualizado de randomSum:", randomSum);
}

// Realizar la primera ejecución de peticiones al cargar el servidor
realizarPeticiones();

// Actualizar la variable cada 10 segundos (10000 milisegundos)
setInterval(updateRandomSum, 50000);

async function realizarPeticiones() {
    const apiKeyGet = "9W93AksSPoZi7Hmsl3e0rLZwDx9RmR07ZHEgSk2u"; // API key para la solicitud GET
    const apiKeyPost = "vFHye6w4VFKjoRkWpPa49hxoUVTcZC3aGBptdNT7"; // API key para la solicitud POST

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

        // Iterar sobre cada objeto en updatedSalesData y enviarlos uno por uno
        for (const updatedProduct of updatedSalesData) {
            // Imprimir el objeto actual en la consola
            console.log("Enviando producto:", updatedProduct);

            // Enviar el objeto actual a la nueva API usando la API key correspondiente
            await sendToStelOrderAPI("https://app.stelorder.com/app/products", apiKeyPost, updatedProduct);

            // Pausar la ejecución durante unos segundos (ajusta según sea necesario)
            await sleep(1000); // Puedes ajustar el tiempo de pausa según tus necesidades
        }

        // Marcar las peticiones como realizadas
        peticionesRealizadas = true;

        console.log("Peticiones realizadas correctamente");
    } catch (error) {
        // Manejar errores al realizar la solicitud
        console.error("Error al hacer la solicitud:", error);
    }
}

async function requestController(req, res) {
    // Resetear la variable peticionesRealizadas a false al comienzo de cada solicitud HTTP
    peticionesRealizadas = false;

    // Realizar las peticiones solo si aún no se han realizado
    if (!peticionesRealizadas) {
        // Llamar a la función para realizar las peticiones
        await realizarPeticiones();
    }

    // Responder con los datos formateados
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Peticiones realizadas correctamente" }));
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

// Función para pausar la ejecución (promesa)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Configurar el servidor
const server = require("http").createServer(requestController);

// Obtener el puerto de las variables de entorno o utilizar el puerto 4000 por defecto
const PORT = process.env.PORT || 5000;

server.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
 