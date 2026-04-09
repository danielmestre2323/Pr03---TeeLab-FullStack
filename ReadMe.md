# TeeLab FullStack

Micro-tienda de camisetas con diseños artísticos. Proyecto fullstack con frontend en HTML/CSS/JS y backend en Node.js + Express.

---

## Estructura del proyecto

```
TENDA/
├── data/
│   ├── catalogoData.js
│   └── comandasData.js
├── node_modules/
├── public/
│   ├── css/
│   │   ├── base.css
│   │   ├── header.css
│   │   ├── catalogo.css
│   │   ├── filtros.css
│   │   ├── carrito.css
│   │   └── ticket.css
│   ├── js/
│   │   ├── productos.js
│   │   ├── carrito.js
│   │   └── ticket.js
│   └── img/
│       ├── MACACARENA.png
│       ├── NINETIES.png
│       ├── RESERVOIR.png
│       └── VITRUVIAN.png
├── src/
│   ├── controllers/
│   │   ├── camisetas.controller.js
│   │   └── comandas.controller.js
│   ├── routes/
│   │   ├── camisetas.routes.js
│   │   └── comandas.routes.js
│   └── services/
│       ├── camisetas.service.js
│       ├── comandas.service.js
│       └── validacion.js
├── views/
│   ├── productos.html
│   ├── carrito.html
│   └── ticket.html
├── package.json
├── package-lock.json
├── ReadMe.md
└── server.js
```

---

## Arrancar el backend

### Requisitos
- Node.js v18 o superior
- npm

### Pasos

```bash
# 1. Entrar en la carpeta del proyecto
cd TENDA

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Arrancar el servidor
node server.js
```

El servidor quedará corriendo en: **http://localhost:3000**

---

## Arrancar el frontend

El frontend se sirve con **Live Server** (extensión de VS Code).

### Pasos

1. Abre la carpeta `TENDA` en VS Code
2. Haz clic derecho sobre `views/productos.html`
3. Selecciona **"Open with Live Server"**

El frontend quedará disponible en: **http://127.0.0.1:5500/views/productos.html**

> ⚠️ El backend debe estar corriendo antes de abrir el frontend.

---

## Endpoints utilizados

### Camisetas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/camisetas` | Obtener todas las camisetas |
| GET | `/api/camisetas?talla=M&color=negro&sort=precio_asc` | Filtrar y ordenar camisetas |
| GET | `/api/camisetas/:id` | Obtener detalle de una camiseta |

**Query params disponibles:**

| Param | Valores | Descripción |
|-------|---------|-------------|
| `talla` | S, M, L, XL, XXL | Filtrar por talla |
| `color` | blanco, negro, gris... | Filtrar por color |
| `q` | texto libre | Buscar por nombre o descripción |
| `sort` | precio_asc, precio_desc, nombre_asc, nombre_desc | Ordenar resultados |

### Comandas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/comandas` | Crear una nueva comanda |
| GET | `/api/comandas` | Obtener todas las comandas |
| GET | `/api/comandas/:id` | Obtener detalle de una comanda |

**Body esperado en POST `/api/comandas`:**

```json
{
  "cliente": {
    "nombre": "Usuario de Prueba",
    "email": "usuario@gmail.com"
  },
  "direccion": "Aiguablava 123, 08031 Barcelona",
  "items": [
    {
      "camisetaId": "TSH01",
      "talla": "M",
      "color": "negro",
      "cantidad": 2
    }
  ]
}
```

---

## Tecnologías utilizadas

**Frontend**
- HTML5 / CSS3 / JavaScript (ES6+)
- `fetch` + `async/await` para comunicación con la API
- `localStorage` para persistencia del carrito y ticket

**Backend**
- Node.js
- Express
- CORS habilitado
- Almacenamiento en memoria (arrays)