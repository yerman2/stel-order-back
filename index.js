require("dotenv").config();
const http = require("follow-redirects").http; // Modificado para utilizar follow-redirects

function requestController(req, res) {
    const apiKey = "TIvATRBiICTwkGyTD46GI4sOKNPHhI3cMCjYC4QE"; // Tu clave API

    // Configurar los parámetros de la solicitud a la URL proporcionada
    const options = {
        hostname: "app.stelorder.com",
        path: "/app/products",
        method: "GET",
        headers: {
            "APIKEY": apiKey,
        },
    };

    // Realizar la solicitud a la URL proporcionada
    const apiRequest = http.request(options, apiResponse => {
        let data = "";

        // Recibir datos de la respuesta de la API
        apiResponse.on("data", chunk => {
            data += chunk;
        });

        // Al completar la respuesta, manejar la lógica
        apiResponse.on("end", () => {
            try {
                // Convertir la cadena JSON recibida a un objeto JavaScript
                const responseData = JSON.parse(data);

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

                // Responder con los datos formateados
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(updatedSalesData));
            } catch (error) {
                // Manejar errores al analizar la respuesta JSON
                console.error("Error al analizar la respuesta JSON:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error interno del servidor");
            }
        });
    });

    // Manejar errores de la solicitud a la API
    apiRequest.on("error", error => {
        console.error("Error al hacer la solicitud:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error interno del servidor");
    });

    // Finalizar la solicitud a la API
    apiRequest.end();
}

// Configurar el servidor
const server = http.createServer(requestController);

// Obtener el puerto de las variables de entorno o utilizar el puerto 4000 por defecto
const PORT = process.env.PORT || 4000;

server.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
