const API_URL = 'http://localhost:3000/api/camisetas';
const contenedorPrincipal = document.querySelector('.container');

// PUNTO DE ENTRADA
async function init() {
  configurarFiltros();
  await cargarCamisetas();
}

// FILTROS — llaman a la API con query params
function configurarFiltros() {
  const filtros = ['filtro-texto', 'filtro-talla', 'filtro-color', 'filtro-sort'];
  filtros.forEach(id => {
    const el = document.getElementById(id);
    const evento = id === 'filtro-texto' ? 'input' : 'change';
    el.addEventListener(evento, aplicarFiltros);
  });

  document.getElementById('btn-limpiar-filtros')
    .addEventListener('click', limpiarFiltros);
}

function leerFiltros() {
  return {
    q: document.getElementById('filtro-texto').value.trim(),
    talla: document.getElementById('filtro-talla').value,
    color: document.getElementById('filtro-color').value,
    sort:  document.getElementById('filtro-sort').value,
  };
}

async function aplicarFiltros() {
  const params = leerFiltros();
  // Quitamos los vacíos para no enviar query params innecesarios
  Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
  await cargarCamisetas(params);
}

function limpiarFiltros() {
  document.getElementById('filtro-texto').value = '';
  document.getElementById('filtro-talla').value = '';
  document.getElementById('filtro-color').value = '';
  document.getElementById('filtro-sort').value  = '';
  cargarCamisetas();
}

// CARGA Y RENDERIZADO DEL CATÁLOGO

async function cargarCamisetas(params = {}) {
  try {
    const url = construirURL(API_URL, params);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const productos = await res.json();
    renderizarCatalogo(productos);
  } catch (err) {
    mostrarErrorCarga(err);
  }
}

function construirURL(base, params) {
  const query = new URLSearchParams(params).toString();
  return query ? `${base}?${query}` : base;
}

function mostrarErrorCarga(err) {
  console.error('Error al cargar las camisetas:', err);
  contenedorPrincipal.innerHTML =
    '<p>Error al cargar el catálogo. Asegúrate de que el servidor está corriendo.</p>';
}

function renderizarCatalogo(productos) {
  contenedorPrincipal.innerHTML = '';
  if (productos.length === 0) {
    contenedorPrincipal.innerHTML = '<p style="color:white; text-align:center;">No se encontraron camisetas con esos filtros.</p>';
    return;
  }
  for (const producto of productos) {
    const elementos = crearEstructuraTarjeta();
    rellenarTarjeta(elementos, producto);
    contenedorPrincipal.appendChild(elementos.contenedor);
  }
}


// CREACIÓN DEL DOM DE LA TARJETA

function crearElemento(etiqueta, clase = '', texto = '') {
  const el = document.createElement(etiqueta);
  if (clase) el.classList.add(...clase.split(' ').filter(Boolean));
  if (texto) el.innerText = texto;
  return el;
}

function crearEstructuraTarjeta() {
  const contenedor = crearElemento('article', 'card');
  const cImagen = crearElemento('div', 'img-container');
  const imagen = document.createElement('img');
  const etiqueta = crearElemento('span', 'badge');
  const nombre = crearElemento('h2');
  const descripcion = crearElemento('p');
  const precio = crearElemento('h3');
  const labelTalla = crearElemento('label', '', 'Talla:');
  const grupTalla = crearElemento('div', 'btn-group');
  const labelColor = crearElemento('label', '', 'Color:');
  const grupColor = crearElemento('div', 'btn-group');
  const labelCantidad = crearElemento('label', '', 'Cantidad:');
  const controlCantidad = crearControlCantidad();
  const boton = crearElemento('button', 'btn-cistella', 'AÑADIR AL CARRITO');

  cImagen.appendChild(imagen);
  contenedor.append(
    cImagen, etiqueta, nombre, descripcion, precio,
    labelTalla, grupTalla, labelColor, grupColor,
    labelCantidad, controlCantidad.wrapper, boton
  );

  return { contenedor, imagen, etiqueta, nombre, descripcion, precio,
           grupTalla, grupColor, controlCantidad, boton };
}

function crearControlCantidad() {
  const wrapper = crearElemento('div', 'qty-control');
  const btnMenos = crearElemento('button', 'qty-btn', '−');
  const display = crearElemento('span', 'qty-display', '1');
  const btnMas = crearElemento('button', 'qty-btn', '+');
  let cantidad = 1;

  btnMenos.addEventListener('click', () => {
    if (cantidad > 1) { cantidad--; display.innerText = cantidad; }
  });
  btnMas.addEventListener('click', () => {
    if (cantidad < 10) { cantidad++; display.innerText = cantidad; }
  });

  wrapper.append(btnMenos, display, btnMas);
  wrapper.getValue = () => cantidad;
  return { wrapper };
}

function rellenarTarjeta(elementos, producto) {
  elementos.nombre.innerText = producto.nombre;
  elementos.descripcion.innerText = producto.descripcion;
  elementos.precio.innerText = producto.precioBase + '€';

  const imagenUrl = Object.values(producto.imagenes)[0] || '';
  elementos.imagen.src = `http://localhost:3000/${imagenUrl}`;
  elementos.imagen.alt = producto.nombre;

  configurarEtiqueta(elementos.etiqueta, producto.tags);
  crearBotonesTalla(elementos.grupTalla, producto.tallas);
  crearBotonesColor(elementos.grupColor, producto.colores);
  configurarEventosTarjeta(elementos, producto);
}

function configurarEtiqueta(etiqueta, tags) {
  if (tags && tags.length > 0) {
    etiqueta.innerText = tags[0].toUpperCase();
    etiqueta.style.display = 'inline-block';
  } else {
    etiqueta.style.display = 'none';
  }
}

function crearBotonesTalla(grupo, tallas) {
  grupo.innerHTML = '';
  tallas.forEach((talla, i) => {
    const btn = crearElemento('button', 'option-btn', talla);
    if (i === 0) btn.classList.add('selected');
    btn.addEventListener('click', () => seleccionarBoton(grupo, btn));
    grupo.appendChild(btn);
  });
}

function crearBotonesColor(grupo, colores) {
  grupo.innerHTML = '';
  colores.forEach((color, i) => {
    const btn = crearElemento('button', 'option-btn color-btn');
    btn.title = color;
    btn.dataset.color = color;
    const circulo = crearElemento('span', 'color-circle');
    circulo.style.backgroundColor = colorACss(color);
    btn.append(circulo, crearElemento('span', '', color));
    if (i === 0) btn.classList.add('selected');
    btn.addEventListener('click', () => seleccionarBoton(grupo, btn));
    grupo.appendChild(btn);
  });
}

function seleccionarBoton(grupo, btnActivo) {
  grupo.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnActivo.classList.add('selected');
}

function colorACss(nombre) {
  const mapa = {
    blanco: '#f5f5f5', negro: '#1a1a1a', mostaza: '#c9a227',
    gris: '#9e9e9e', azul: '#1565c0', rojo: '#c62828',
    verde: '#2e7d32', rosa: '#e91e63', naranja: '#e65100'
  };
  return mapa[nombre.toLowerCase()] || '#cccccc';
}

// EVENTOS DE LA TARJETA

function configurarEventosTarjeta(elementos, producto) {
  elementos.boton.addEventListener('click', () => addToCart(elementos, producto));
}

// LÓGICA DEL CARRITO

function addToCart(elementos, producto) {
  const tallaBtn = elementos.grupTalla.querySelector('.selected');
  const colorBtn = elementos.grupColor.querySelector('.selected');

  const item = {
    camisetaId: producto.id,
    nombre: producto.nombre,
    precio: producto.precioBase,
    talla: tallaBtn ? tallaBtn.innerText : producto.tallas[0],
    color: colorBtn ? colorBtn.dataset.color : producto.colores[0],
    cantidad: elementos.controlCantidad.wrapper.getValue(),
    imagen: elementos.imagen.src
  };

  const carrito = loadCart();
  actualizarOInsertarItem(carrito, item);
  saveCart(carrito);
  mostrarFeedback(elementos.boton);
}

function actualizarOInsertarItem(carrito, itemNuevo) {
  const idx = carrito.findIndex(i =>
    i.camisetaId === itemNuevo.camisetaId &&
    i.talla === itemNuevo.talla &&
    i.color === itemNuevo.color
  );
  if (idx !== -1) {
    carrito[idx].cantidad += itemNuevo.cantidad;
  } else {
    carrito.push(itemNuevo);
  }
}

function mostrarFeedback(boton) {
  const textoOriginal = boton.innerText;
  boton.innerText = '✓ AÑADIDO';
  boton.style.backgroundColor  = '#2e7d32';
  boton.disabled = true;
  setTimeout(() => {
    boton.innerText = textoOriginal;
    boton.style.backgroundColor  = '';
    boton.disabled = false;
  }, 1500);
}

function loadCart() {
  return JSON.parse(localStorage.getItem('carritoTeeLab')) || [];
}

function saveCart(carrito) {
  localStorage.setItem('carritoTeeLab', JSON.stringify(carrito));
}

// ARRANQUE

init();