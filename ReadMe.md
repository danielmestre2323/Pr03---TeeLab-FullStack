# TeeLab API

API REST para la micro-tienda TeeLab. Permite consultar el catálogo de camisetas y gestionar comandas (pedidos).

## Requisitos

- Node.js v18 o superior
- npm

## Instalación y arranque

```bash
npm install
npm run dev
```

El servidor arranca en `http://localhost:3000`.

> Para que `npm run dev` funcione, asegúrate de tener el script en `package.json`:
> ```json
> "scripts": {
>   "dev": "nodemon server.js",
>   "start": "node server.js"
> }
> ```

---

## Endpoints

### Camisetas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/camisetas` | Lista todas las camisetas |
| GET | `/api/camisetas/:id` | Detalle de una camiseta |

#### Filtros disponibles en GET `/api/camisetas`

| Query param | Ejemplo | Descripción |
|-------------|---------|-------------|
| `talla` | `?talla=M` | Filtra por talla |
| `color` | `?color=negro` | Filtra por color |
| `tag` | `?tag=nuevo` | Filtra por tag |
| `q` | `?q=gato` | Busca en nombre o descripción |
| `sort` | `?sort=precio_asc` | Ordena resultados |

Valores válidos de `sort`: `precio_asc`, `precio_desc`, `nombre_asc`, `nombre_desc`.
Si se envía un `sort` no reconocido → responde `400`.

---

### Comandas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/comandas` | Crea una nueva comanda |
| GET | `/api/comandas` | Lista todas las comandas |
| GET | `/api/comandas/:id` | Detalle de una comanda |

#### Body esperado en POST `/api/comandas`

```json
{
  "cliente": {
    "nombre": "Ana",
    "email": "ana@mail.com"
  },
  "direccion": {
    "calle": "Carrer Major 1",
    "cp": "08400",
    "ciudad": "Granollers"
  },
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

#### Respuesta exitosa (201)

```json
{
  "id": "ORD-0001",
  "fecha": "2026-03-22T10:00:00.000Z",
  "estado": "recibida",
  "cliente": { "nombre": "Ana", "email": "ana@mail.com" },
  "direccion": { "calle": "Carrer Major 1", "cp": "08400", "ciudad": "Granollers" },
  "items": [
    {
      "camisetaId": "TSH01",
      "nombre": "MACACARENA",
      "talla": "M",
      "color": "negro",
      "cantidad": 2,
      "precioUnitario": 19.95,
      "subtotal": 39.90
    }
  ],
  "total": 39.90
}
```

#### Validaciones del POST

- `cliente.nombre` obligatorio, mínimo 2 caracteres
- `cliente.email` obligatorio, formato válido
- `items` obligatorio, mínimo 1 elemento
- `cantidad` entero ≥ 1
- `camisetaId` debe existir en el catálogo
- `talla` debe estar disponible en esa camiseta
- `color` debe estar disponible en esa camiseta

Si alguna validación falla → responde `400` indicando el campo concreto que ha fallado.

---

## Estructura del proyecto

```
TENDA/
├── data/
│   ├── catalogoData.js         # Catálogo de camisetas
│   └── comandasData.js         # Almacén en memoria de comandas
├── node_modules/
├── public/                     # Carpeta para guardar el frontEnd(no esta conectada al backend por ahora)
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
│       └── Validacion.js
├── views/                      # Carpeta para guardar el html
├── package-lock.json
├── package.json
├── ReadMe.md
└── server.js
```