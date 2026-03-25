//Importamos las funciones del service
const { crearComanda, getComandasAll, getComandaById } = require('../services/comandas.service');

//Crea una comanda nueva con los datos del body y devuelve el ticket
function crearComandaController(req, res) {
  const resultado = crearComanda(req.body);

  //Si la validacion falla devolvemos un error 400 con el mensaje del campo que ha fallado
  if (resultado.error) {
    return res.status(400).json({ error: resultado.error });
  }

  res.status(201).json(resultado.data);
}

//Devuelve todas las comandas guardadas en memoria
function listarComandas(req, res) {
  const comandas = getComandasAll();
  res.status(200).json(comandas);
}

//Devuelve el detalle de una comanda concreta por su id
function detalleComanda(req, res) {
  const { id } = req.params;

  const comanda = getComandaById(id);

  //Si no existe la comanda devolvemos un error 404
  if (!comanda) {
    return res.status(404).json({ error: 'Comanda no encontrada' });
  }

  res.status(200).json(comanda);
}

module.exports = { crearComandaController, listarComandas, detalleComanda };