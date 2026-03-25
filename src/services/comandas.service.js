//Importamos el almacen en memoria, el catalogo y la funcion de validacion
const comandas = require('../../data/comandasData');
const camisetas = require('../../data/catalogoData');
const { validarComanda } = require('./validacion');

//Genera un id unico para cada comanda en formato ORD-0001
function generarId() {
  const numero = String(comandas.length + 1).padStart(4, '0');
  return `ORD-${numero}`;
}

//Valida el body, calcula el ticket y guarda la comanda en memoria
function crearComanda(body) {
  //Si hay algun error de validacion lo devolvemos sin continuar
  const errorValidacion = validarComanda(body);
  if (errorValidacion) {
    return { error: errorValidacion };
  }

  const { cliente, direccion, items } = body;

  //Para cada item buscamos su camiseta y calculamos el subtotal
  const itemsCalculados = items.map(item => {
    const camiseta = camisetas.find(c => c.id === item.camisetaId);
    const precioUnitario = camiseta.precioBase;
    const subtotal = parseFloat((precioUnitario * item.cantidad).toFixed(2));

    return {
      camisetaId: item.camisetaId,
      nombre: camiseta.nombre,
      talla: item.talla,
      color: item.color,
      cantidad: item.cantidad,
      precioUnitario,
      subtotal
    };
  });

  //Sumamos todos los subtotales para obtener el total del pedido
  const total = parseFloat(
    itemsCalculados.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
  );

  //Construimos el objeto comanda completo
  const nuevaComanda = {
    id: generarId(),
    fecha: new Date().toISOString(),
    estado: 'recibida',
    cliente,
    direccion,
    items: itemsCalculados,
    total
  };

  //Guardamos la comanda en el array en memoria
  comandas.push(nuevaComanda);

  return { data: nuevaComanda };
}

//Devuelve todas las comandas guardadas
function getComandasAll() {
  return comandas;
}

//Busca una comanda por su id y la devuelve, o null si no existe
function getComandaById(id) {
  const comanda = comandas.find(c => c.id === id);
  return comanda || null;
}

module.exports = { crearComanda, getComandasAll, getComandaById };