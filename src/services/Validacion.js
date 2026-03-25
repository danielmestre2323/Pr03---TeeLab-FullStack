//Importamos el catalogo para comprobar que los ids, tallas y colores existen
const camisetas = require('../../data/catalogoData');

//Valida todos los campos del body de una comanda
function validarComanda(body) {
  const { cliente, items } = body;

  //El nombre del cliente es obligatorio y debe tener minimo 2 caracteres
  if (!cliente || !cliente.nombre || cliente.nombre.trim().length < 2) {
    return 'El campo cliente.nombre es obligatorio y debe tener minimo 2 caracteres';
  }

  //Ponemos un regex para que el Email tenga un formato valido
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cliente.email || !regexEmail.test(cliente.email)) {
    return 'El campo cliente.email es obligatorio y debe tener un formato valido';
  }

  //Items debe ser un array con al menos un elemento
  if (!items || !Array.isArray(items) || items.length < 1) {
    return 'El campo items es obligatorio y debe contener al menos 1 elemento';
  }

  //Validamos cada item del pedido
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    //La cantidad debe ser un entero mayor o igual a 1
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1) {
      return `items[${i}]: cantidad debe ser un entero mayor o igual a 1`;
    }

    //El id de la camiseta debe existir en el catalogo
    const camiseta = camisetas.find(c => c.id === item.camisetaId);
    if (!camiseta) {
      return `items[${i}]: camisetaId "${item.camisetaId}" no existe en el catalogo`;
    }

    //La talla debe estar disponible en esa camiseta
    if (!camiseta.tallas.includes(item.talla)) {
      return `items[${i}]: la talla "${item.talla}" no esta disponible. Tallas disponibles: ${camiseta.tallas.join(', ')}`;
    }

    //El color debe estar disponible en esa camiseta
    if (!camiseta.colores.includes(item.color)) {
      return `items[${i}]: el color "${item.color}" no esta disponible. Colores disponibles: ${camiseta.colores.join(', ')}`;
    }
  }

  //Si todo esta correcto
  return null;
}

module.exports = { validarComanda };