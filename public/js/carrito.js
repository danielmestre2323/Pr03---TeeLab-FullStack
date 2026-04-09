const API_COMANDAS = 'http://localhost:3000/api/comandas';

// ENTRADA

function init() {
  renderCart();
}


// WEBSTORAGE

function loadCart() {
  return JSON.parse(localStorage.getItem('carritoTeeLab')) || [];
}

function saveCart(carrito) {
  localStorage.setItem('carritoTeeLab', JSON.stringify(carrito));
}

// RENDERIZADO DEL CARRITO

function renderCart() {
  const contenedor = document.getElementById('contenedor-carrito');
  const resumen = document.getElementById('resumen-pedido');
  const precioTotal = document.getElementById('precio-total');
  const totalItems = document.getElementById('total-items');

  const carrito = loadCart();
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="cesta-vacia">Tu cesta de la compra está vacía.</p>';
    resumen.style.display = 'none';
    return;
  }

  resumen.style.display = 'flex';

  let sumaTotal = 0;
  let sumaCantidad = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    sumaTotal += subtotal;
    sumaCantidad += item.cantidad;
    contenedor.appendChild(crearFilaItem(item, index, subtotal));
  });

  precioTotal.innerText = sumaTotal.toFixed(2);
  totalItems.innerText  = sumaCantidad;

  asignarEventosEliminar();
  document.getElementById('btn-vaciar').addEventListener('click', vaciarCarrito);
  document.getElementById('btn-pagar').onclick = procesarPago;
}

function crearFilaItem(item, index, subtotal) {
  const fila = document.createElement('div');
  fila.classList.add('cesta-item');
  fila.innerHTML = `
    <div class="cesta-imagen">
      <img src="${item.imagen}" alt="${item.nombre}">
    </div>
    <div class="cesta-detalles">
      <h3>${item.nombre}</h3>
      <p class="stock-texto">En stock</p>
      <p class="variante-texto"><strong>Talla:</strong> ${item.talla}</p>
      <p class="variante-texto"><strong>Color:</strong> ${item.color}</p>
      <p class="variante-texto"><strong>Cantidad:</strong> ${item.cantidad}</p>
    </div>
    <div class="cesta-precio-item">
      <strong>${subtotal.toFixed(2)}€</strong>
    </div>
    <button class="btn-eliminar btn-basura" data-index="${index}" aria-label="Eliminar producto">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  `;
  return fila;
}

function asignarEventosEliminar() {
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      eliminarItem(e.currentTarget.dataset.index);
    });
  });
}

function eliminarItem(index) {
  const carrito = loadCart();
  carrito.splice(index, 1);
  saveCart(carrito);
  renderCart();
}

function vaciarCarrito() {
  saveCart([]);
  renderCart();
}

// ENVIAR COMANDA AL BACKEND
async function procesarPago() {
  const carrito = loadCart();
  const btnPagar = document.getElementById('btn-pagar');

  btnPagar.innerText = 'PROCESANDO...';
  btnPagar.disabled = true;

  const items = carrito.map(item => ({
    camisetaId: item.camisetaId,
    talla: item.talla,
    color: item.color,
    cantidad:   item.cantidad
  }));

  const comanda = {
    cliente: { nombre: 'Usuario de Prueba', email: 'usuario@gmail.com' },
    direccion: 'Aiguablava 123, 08031 Barcelona',
    items
  };

  try {
    const res = await fetch(API_COMANDAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comanda)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Error HTTP: ${res.status}`);
    }

    const ticket = await res.json();

    localStorage.setItem('ultimoTicket', JSON.stringify(ticket));
    localStorage.setItem('ultimoOrderId', ticket.id);
    localStorage.removeItem('carritoTeeLab');

    mostrarTicketEnPantalla(ticket);

  } catch (err) {
    console.error('Error al procesar el pago:', err);
    alert(`No se pudo procesar el pedido: ${err.message}`);
    btnPagar.innerText = 'TRAMITAR PEDIDO';
    btnPagar.disabled  = false;
  }
}

// MOSTRAR TICKET TRAS EL PAGO

function mostrarTicketEnPantalla(ticket) {
  const main = document.querySelector('main');
  main.innerHTML = construirHTMLTicket(ticket);
}

function construirHTMLTicket(ticket) {
  const lineas = ticket.items.map(item => `
    <div class="cesta-item">
      <div class="cesta-detalles">
        <h3>${item.nombre}</h3>
        <p class="variante-texto"><strong>Talla:</strong> ${item.talla} | <strong>Color:</strong> ${item.color}</p>
        <p class="variante-texto"><strong>Cantidad:</strong> ${item.cantidad} × ${item.precioUnitario.toFixed(2)}€</p>
      </div>
      <div class="cesta-precio-item"><strong>${item.subtotal.toFixed(2)}€</strong></div>
    </div>
  `).join('');

  return `
    <div class="cesta-container">
      <div class="cesta-header">
        <div class="cesta-titulo">
          <h1>Pedido confirmado</h1>
        </div>
      </div>
      <p><strong>ID Pedido:</strong> ${ticket.id}</p>
      <p><strong>Fecha:</strong> ${new Date(ticket.fecha).toLocaleString('es-ES')}</p>
      <p><strong>Estado:</strong> ${ticket.estado}</p>
      <p><strong>Cliente:</strong> ${ticket.cliente.nombre} (${ticket.cliente.email})</p>
      <p><strong>Dirección:</strong> ${ticket.direccion}</p>
      <hr style="margin: 15px 0; border-color: #ddd;">
      ${lineas}
      <div class="cesta-footer">
        <div class="subtotal-texto"><strong>Total: ${ticket.total.toFixed(2)}€</strong></div>
        <a href="productos.html" class="btn-cistella btn-tramitar" style="text-decoration:none; text-align:center;">
          SEGUIR COMPRANDO
        </a>
      </div>
    </div>
  `;
}

// ARRANQUE
init();