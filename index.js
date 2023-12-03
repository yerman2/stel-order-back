const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);

  console.log('¡Hola, Deploy test!');
});
