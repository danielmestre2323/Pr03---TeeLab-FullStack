const camisetas = [
  {
    id: "TSH01",
    nombre: "MACACARENA",
    descripcion: "Quan balles sense vergonya i el ritme et domina.",
    precioBase: 19.95,
    tallas: ["S", "M", "L", "XL"],
    colores: ["blanco", "negro", "mostaza"],
    imagenes: {
      blanco: "img/MACACARENA.png",
      negro: "img/MACACARENA.png",
      mostaza: "img/MACACARENA.png"
    },
    tags: ["nuevo"]
  },
  {
    id: "TSH02",
    nombre: "NINETIES MODE",
    descripcion: "Un homenatge pixelat als anys 90.",
    precioBase: 21.50,
    tallas: ["S", "M", "L", "XL", "XXL"],
    colores: ["gris", "negro"],
    imagenes: {
      gris: "img/NINETIES.png",
      negro: "img/NINETIES.png"
    },
    tags: ["retro"]
  },
  {
    id: "TSH03",
    nombre: "RESERVOIR INVADERS",
    descripcion: "Quan Tarantino coneix els videojocs classics.",
    precioBase: 22.90,
    tallas: ["M", "L", "XL"],
    colores: ["azul", "negro"],
    imagenes: {
      azul: "img/RESERVOIR.png",
      negro: "img/RESERVOIR.png"
    },
    tags: ["edicion-especial"]
  },
  {
    id: "TSH04",
    nombre: "VITRUVIAN CODE",
    descripcion: "Art, codi i proporcio perfecta.",
    precioBase: 24.00,
    tallas: ["S", "M", "L", "XL"],
    colores: ["blanco", "negro"],
    imagenes: {
      blanco: "img/VITRUVIAN.png",
      negro: "img/VITRUVIAN.png"
    },
    tags: ["premium"]
  }
];

module.exports = camisetas;