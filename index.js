require("dotenv").config();
const axios = require("axios");

let randomSum = 0;
let peticionesRealizadas = false;
let datosEnviados = new Set();

function updateRandomSum() {
    const randomNumber1 = Math.floor(Math.random() * 1000) + 1;
    const randomNumber2 = Math.floor(Math.random() * 1000) + 1;
    randomSum = randomNumber1 + randomNumber2;
    console.log("Valor actualizado de randomSum:", randomSum);
}

async function realizarPeticiones() {
    const apiKeyGet = "9W93AksSPoZi7Hmsl3e0rLZwDx9RmR07ZHEgSk2u";
    const apiKeyPost = "y7R6aTyneWkrj8djBcwKnD33sTJ6C5s2lreuy3ji";

    try {
        const response = await axios.get("https://app.stelorder.com/app/products", {
            params: {
                APIKEY: apiKeyGet,
            },
        });

        const updatedSalesData = response.data.map(item => {
            return {
                "description": item.description,
                "name": item.name,
                "sales-price": item["sales-price"] * 1.25,
            };
        });

        for (const updatedProduct of updatedSalesData) {
            const stringifiedProduct = JSON.stringify(updatedProduct);

            if (!datosEnviados.has(stringifiedProduct)) {
                console.log("Enviando producto:", updatedProduct);
                await sendToStelOrderAPI("https://app.stelorder.com/app/products", apiKeyPost, updatedProduct);
                datosEnviados.add(stringifiedProduct);
                await sleep(1000);
            } else {
                console.log("El dato ya se ha enviado previamente.");
            }
        }

        console.log("Peticiones realizadas correctamente");
    } catch (error) {
        console.error("Error al hacer la solicitud:", error);
    }
}

async function sendToStelOrderAPI(apiUrl, apiKey, dato) {
    try {
        const urlWithApiKey = `${apiUrl}?APIKEY=${apiKey}`;
        const response = await axios.post(urlWithApiKey, dato, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Agrega logs para debug
        // console.log("Respuesta de la API de StelOrder:", response.data);
    } catch (error) {
        console.error("Error al enviar datos a la API de StelOrder:", error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const server = require("http").createServer(requestController);

const PORT = process.env.PORT || 5000;

server.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

async function requestController(req, res) {
    peticionesRealizadas = false;

    if (!peticionesRealizadas) {
        await realizarPeticiones();
        peticionesRealizadas = true;
    }

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Peticiones realizadas correctamente" }));
}
