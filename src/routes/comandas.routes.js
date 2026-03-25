//Importamos los recursos
const express = require('express');
const router = express.Router();
const { crearComandaController, listarComandas, detalleComanda } = require('../controllers/comandas.controller');

//Crear una comanda nueva
router.post('/', crearComandaController);

//Listado de todas las comandas y detalle de una comanda concreta
router.get('/', listarComandas);
router.get('/:id', detalleComanda);

module.exports = router;