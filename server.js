const express = require('express');
const cors = require('cors');

const camisetasRoutes = require('./src/routes/camisetas.routes');
const comandasRoutes  = require('./src/routes/comandas.routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/camisetas', camisetasRoutes);
app.use('/api/comandas', comandasRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor TeeLab corriendo en http://localhost:${PORT}`);
});

module.exports = app;