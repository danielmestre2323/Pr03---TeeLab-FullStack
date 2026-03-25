//Importamos las funciones del service
const { getCamisetas, getCamisetaById } = require('../services/camisetas.service');

//Devuelve el listado de camisetas aplicando los filtros
function listarCamisetas(req, res) {
  const { talla, color, tag, q, sort } = req.query;

  const resultado = getCamisetas({ talla, color, tag, q, sort });

  //Si el sort no es valido devolvemos un error 400
  if (resultado.error) {
    return res.status(400).json({ error: resultado.error });
  }

  res.status(200).json(resultado.data);
}

//Devuelve el detalle de una camiseta concreta por su id
function detalleCamiseta(req, res) {
  const { id } = req.params;

  const camiseta = getCamisetaById(id);

  //Si no existe la camiseta devolvemos un error 404
  if (!camiseta) {
    return res.status(404).json({ error: 'Camiseta no encontrada' });
  }

  res.status(200).json(camiseta);
}

module.exports = { listarCamisetas, detalleCamiseta };