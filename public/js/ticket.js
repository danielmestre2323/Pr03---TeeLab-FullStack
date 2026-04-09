// PUNTO DE ENTRADA

function init() {
  const ticket = loadTicket();
  if (ticket) {
    renderTicket(ticket);
  } else {
    mostrarErrorTicket();
  }
}

// WEBSTORAGE

function loadTicket() {
  return JSON.parse(localStorage.getItem('ultimoTicket')) || null;
}

// RENDERIZADO DEL TICKET

function renderTicket(ticket) {
  const contenedor = document.getElementById('contenedor-ticket');
  contenedor.innerHTML = construirCabecera(ticket) + construirLineas(ticket) + construirFooter(ticket);
}

function construirCabecera(ticket) {
  const fecha = new Date(ticket.fecha).toLocaleString('es-ES');
  return `
    <div class="ticket-cabecera">
      <h1>¡Pedido confirmado!</h1>
      <p class="ticket-subtitulo">Gracias por tu compra en TeeLab</p>
    </div>
    <div class="ticket-info">
      <div class="ticket-info-fila">
        <span class="ticket-label">ID Pedido</span>
        <span class="ticket-valor ticket-id">${ticket.id}</span>
      </div>
      <div class="ticket-info-fila">
        <span class="ticket-label">Fecha</span>
        <span class="ticket-valor">${fecha}</span>
      </div>
      <div class="ticket-info-fila">
        <span class="ticket-label">Estado</span>
        <span class="ticket-valor ticket-estado">${ticket.estado.toUpperCase()}</span>
      </div>
      <div class="ticket-info-fila">
        <span class="ticket-label">Cliente</span>
        <span class="ticket-valor">${ticket.cliente.nombre} (${ticket.cliente.email})</span>
      </div>
      <div class="ticket-info-fila">
        <span class="ticket-label">Dirección</span>
        <span class="ticket-valor">${ticket.direccion}</span>
      </div>
    </div>
    <h2 class="ticket-titulo-lineas">Líneas del pedido</h2>
  `;
}

function construirLineas(ticket) {
  return ticket.items.map(item => `
    <div class="cesta-item">
      <div class="cesta-detalles">
        <h3>${item.nombre}</h3>
        <p class="variante-texto"><strong>Talla:</strong> ${item.talla} &nbsp;|&nbsp; <strong>Color:</strong> ${item.color}</p>
        <p class="variante-texto"><strong>Cantidad:</strong> ${item.cantidad} × ${item.precioUnitario.toFixed(2)}€</p>
      </div>
      <div class="cesta-precio-item">
        <strong>${item.subtotal.toFixed(2)}€</strong>
      </div>
    </div>
  `).join('');
}

function construirFooter(ticket) {
  return `
    <div class="cesta-footer">
      <div class="subtotal-texto">
        <strong>Total: ${ticket.total.toFixed(2)}€</strong>
      </div>
      <a href="productos.html" class="btn-cistella btn-tramitar"
         style="text-decoration:none; text-align:center; padding: 12px 30px;">
        SEGUIR COMPRANDO
      </a>
    </div>
  `;
}

function mostrarErrorTicket() {
  document.getElementById('contenedor-ticket').innerHTML = `
    <div style="text-align:center; padding: 40px;">
      <p>No se encontró ningún pedido reciente.</p>
      <a href="productos.html" class="btn-cistella" style="text-decoration:none; display:inline-block; margin-top:20px;">
        IR AL CATÁLOGO
      </a>
    </div>
  `;
}

// ARRANQUE

init();