/* Familias de prueba (todo inventado). Cada familia pertenece a un centro: así los datos de un centro nunca se mezclan con los de otro. */

const hoy = new Date();
const dia = (n, h = 18, m = 0) => { const d = new Date(hoy); d.setDate(d.getDate() - n); d.setHours(h, m, 0, 0); return d.toISOString(); };

function sesiones(id, dias, base, animos = {}) {
  return dias.map((n, i) => ({
    id: `${id}-s${i}`, fecha: dia(n, 17 + (i % 3), (i * 13) % 60), minutos: 4 + (i % 3),
    objetivos: 20, aciertos: Math.min(20, base + Math.round(i * 0.6)), animo: animos[i] ?? (n === 0 ? null : i % 3 ? "contento" : "bien"),
  }));
}

export const FAMILIAS = [
  {
    centro: "crecer", email: "familia@crecer.uy", nombre: "Familia de Martina",
    hijos: [
      {
        id: "h1", nombre: "Martina", edad: 7, color: "coral",
        profesional: { nombre: "Laura", rol: "Fisioterapeuta" },
        rutina: { dias: [1, 2, 3, 4, 5], bloques: [{ titulo: "Alcanzar objetivos", detalle: "Mano derecha · objetivos medianos", minutos: 6 }] },
        sesiones: sesiones("h1", [16, 15, 13, 12, 10, 9, 8, 6, 5, 3, 2, 1, 0], 12),
        mensajes: [
          { id: "m1", de: "profesional", autor: "Laura", texto: "¡Qué bien viene Martina esta semana! Achicamos un poco los objetivos para que sea un desafío.", fecha: dia(5, 10, 5) },
          { id: "m2", de: "familia", autor: "Vos", texto: "¡Gracias! Le encantan las estrellitas del final. Hoy quiso jugar dos veces.", fecha: dia(1, 19, 10) },
          { id: "m3", de: "profesional", autor: "Laura", texto: "¡Genial! Con una vez por día alcanza, pero si tiene ganas está bien.", fecha: dia(0, 9, 30) },
        ],
      },
      {
        id: "h2", nombre: "Tomás", edad: 4, color: "yellow",
        profesional: { nombre: "Martín", rol: "Terapeuta ocupacional" },
        rutina: { dias: [1, 3, 5], bloques: [{ titulo: "Alcanzar objetivos", detalle: "Ambas manos · objetivos grandes", minutos: 4 }] },
        sesiones: sesiones("h2", [9, 7, 4, 2], 9),
        mensajes: [{ id: "m1", de: "profesional", autor: "Martín", texto: "¡Bienvenidos! Empezamos de a poco, 3 veces por semana.", fecha: dia(10, 11) }],
      },
    ],
  },
  {
    centro: "andares", email: "familia@andares.uy", nombre: "Familia de Joaquín",
    hijos: [
      {
        id: "h1", nombre: "Joaquín", edad: 9, color: "teal",
        profesional: { nombre: "Ana", rol: "Fisioterapeuta" },
        rutina: { dias: [1, 2, 4, 5, 6], bloques: [{ titulo: "Para entrar en calor", detalle: "Mano derecha · centro de la pantalla", minutos: 3 }, { titulo: "Alcanzar objetivos", detalle: "Mano izquierda · lado de la mano", minutos: 5 }] },
        sesiones: sesiones("h1", [11, 9, 8, 6, 4, 2], 8, { 5: "cansado" }),
        mensajes: [{ id: "m1", de: "profesional", autor: "Ana", texto: "Hola, ¿cómo vienen con la rutina? Si se cansa, puede hacer solo el primer ejercicio.", fecha: dia(2, 9) }],
      },
    ],
  },
];
