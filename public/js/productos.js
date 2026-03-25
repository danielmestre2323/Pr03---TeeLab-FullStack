app.use(express.static('public'));
let productosObjeto = JSON.parse(productosJSON);
const contenedorPrincipal = document.querySelector('.container');

// Bucle principal
for (const producto of productosObjeto) {
  const elementosDOM = crearHTML();
  insertarContenido(elementosDOM, producto);
  contenedorPrincipal.appendChild(elementosDOM.contenedor);
}

// Creamos la estructura del HTML
function crearHTML() {
  let contenedor = document.createElement('article');
  contenedor.classList.add('card'); 

  // Contenedor para la imagen (el fondo gris)
  let contenedorImagen = document.createElement('div');
  contenedorImagen.classList.add('img-container');
  
  let imagen = document.createElement('img');
  contenedorImagen.appendChild(imagen);

  // Etiqueta naranja (Nuevo, Retro, etc)
  let etiqueta = document.createElement('span');
  etiqueta.classList.add('badge');

  let nombreProducto = document.createElement('h2');
  let descripcion = document.createElement('p');
  let precio = document.createElement('h3');
  
  // Selectores
  let labelTalla = document.createElement('label');
  labelTalla.innerText = "Talla:";
  let selectTalla = document.createElement('select');
  
  let labelColor = document.createElement('label');
  labelColor.innerText = "Color:";
  let selectColor = document.createElement('select');

  let botonCarrito = document.createElement('button');
  botonCarrito.innerText = "AÑADIR AL CARRITO"; 
  botonCarrito.classList.add('btn-cistella'); // Mantenemos la clase CSS original

  // Montamos la estructura
  contenedor.appendChild(contenedorImagen); 
  contenedor.appendChild(etiqueta);        
  contenedor.appendChild(nombreProducto);
  contenedor.appendChild(descripcion);
  contenedor.appendChild(precio);
  
  contenedor.appendChild(labelTalla);
  contenedor.appendChild(selectTalla);
  contenedor.appendChild(labelColor);
  contenedor.appendChild(selectColor);
  
  contenedor.appendChild(botonCarrito);

  // Retornamos el objeto con las referencias
  return {
    contenedor: contenedor,
    nombreProducto: nombreProducto,
    imagen: imagen,
    descripcion: descripcion,
    precio: precio,
    selectTalla: selectTalla,
    selectColor: selectColor,
    etiqueta: etiqueta,
    botonCarrito: botonCarrito
  };
}

function insertarContenido(elementos, producto) {
  elementos.nombreProducto.innerText = producto.nombre;
  
  const primerColor = producto.colores[0];
  elementos.imagen.setAttribute("src", producto.imagenes[primerColor]);
  elementos.imagen.setAttribute("alt", producto.nombre);
  
  // Ponemos el texto del tag y lo hacemos mayúscula
  if(producto.tags && producto.tags.length > 0) {
      elementos.etiqueta.innerText = producto.tags[0].toUpperCase();
  } else {
      elementos.etiqueta.style.display = 'none';
  }

  elementos.descripcion.innerText = producto.descripcion;
  elementos.precio.innerText = producto.precioBase + "€";

  generarOpciones(elementos.selectTalla, producto.tallas);
  generarOpciones(elementos.selectColor, producto.colores);

  // Lógica del botón
  elementos.botonCarrito.addEventListener('click', function() {
      alert("Se ha añadido el producto " + producto.nombre + " al carrito.");
  });
}

function generarOpciones(selectElement, arrayDatos) {
  for (const dato of arrayDatos) {
    let opcion = document.createElement('option');
    opcion.innerHTML = dato;
    opcion.setAttribute('value', dato);
    selectElement.appendChild(opcion);
  }
}