//Importamos el catalogo de camisetas
const camisetas = require('../../data/catalogoData');

//Lista de valores validos para el parametro sort
const SORTS_VALIDOS = ['precio_asc', 'precio_desc', 'nombre_asc', 'nombre_desc'];

//Devuelve las camisetas aplicando filtros y ordenacion
function getCamisetas(filtros) {
  const { talla, color, tag, q, sort } = filtros;

  //Si el sort no es reconocido devolvemos un error
  if (sort && !SORTS_VALIDOS.includes(sort)) {
    return { error: `El parametro sort "${sort}" no es valido. Usa: ${SORTS_VALIDOS.join(', ')}` };
  }

  //Copiamos el array para no modificar el original
  let resultado = [...camisetas];

  //Aplicamos los filtros uno a uno si estan presentes
  if (talla) resultado = resultado.filter(c => c.tallas.includes(talla));
  if (color) resultado = resultado.filter(c => c.colores.includes(color));
  if (tag)   resultado = resultado.filter(c => c.tags.includes(tag));

  //Busqueda por texto en nombre o descripcion
  if (q) {
    const query = q.toLowerCase();
    resultado = resultado.filter(
      c => c.nombre.toLowerCase().includes(query) ||
           c.descripcion.toLowerCase().includes(query)
    );
  }

  //Ordenacion segun el valor de sort
  if (sort === 'precio_asc')  resultado.sort((a, b) => a.precioBase - b.precioBase);
  if (sort === 'precio_desc') resultado.sort((a, b) => b.precioBase - a.precioBase);
  if (sort === 'nombre_asc')  resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (sort === 'nombre_desc') resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));

  return { data: resultado };
}

//Busca una camiseta por su id y la devuelve, o null si no existe
function getCamisetaById(id) {
  const camiseta = camisetas.find(c => c.id === id);
  return camiseta || null;
}

module.exports = { getCamisetas, getCamisetaById };