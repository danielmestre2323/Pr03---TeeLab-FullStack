//Importamos los recursos
const express = require('express');
const router = express.Router();
const { listarCamisetas, detalleCamiseta } = require('../controllers/camisetas.controller');
 
//Listado de camisetas y detalle de una camiseta concreta
router.get('/', listarCamisetas);
router.get('/:id', detalleCamiseta);
 
module.exports = router;
 