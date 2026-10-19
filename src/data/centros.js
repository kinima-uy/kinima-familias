/*
 * CENTROS (multicentro, como Moodle): una sola app, el mismo diseño de Kinima,
 * y cada centro con su propio espacio y contenido.
 *
 * Lo que es de Kinima y NO cambia: tipografías, componentes, estructura, accesibilidad, el juego.
 * Lo que configura cada centro: nombre, logo, color de acento (de una lista aprobada),
 * mensaje de bienvenida, noticias, eventos, información de contacto, recursos, equipo
 * y qué secciones tiene activas.
 *
 * Hoy son datos de prueba (centros inventados). Con la API real, cada centro lo edita su
 * administrador desde el portal profesional y llega acá con getCentro(slug).
 */

/* Colores de acento aprobados: siempre de la paleta Kinima y con contraste AA en el texto. */
export const TEMAS = {
  teal: { acc: "#55BDB5", soft: "#E2F3F1", text: "#23716C", nombre: "Turquesa" },
  coral: { acc: "#EF8B76", soft: "#FCE6E0", text: "#B04A33", nombre: "Coral" },
  amarillo: { acc: "#F2C96D", soft: "#FCF1D8", text: "#7A5A12", nombre: "Amarillo" },
  navy: { acc: "#2C4A66", soft: "#E3E9EF", text: "#19324A", nombre: "Azul" },
};

const d = (n, h = 10) => { const x = new Date(); x.setDate(x.getDate() + n); x.setHours(h, 0, 0, 0); return x.toISOString(); };

export const CENTROS = {
  crecer: {
    slug: "crecer",
    nombre: "Centro Crecer",
    nombreCorto: "Crecer",
    tema: "teal",
    logo: null, // con la API real: URL de la imagen que sube el centro. Mientras sea null se muestran las iniciales.
    iniciales: "CC",
    ciudad: "Montevideo",
    bienvenida: "Acá vas a encontrar la rutina de cada día, los mensajes de tu terapeuta y todo lo que pasa en el centro.",
    modulos: { mensajes: true, noticias: true, eventos: true, recursos: true, equipo: true },
    info: {
      direccion: "Av. Ejemplo 1234, Montevideo",
      horarios: ["Lunes a viernes · 8:00 a 19:00", "Sábados · 9:00 a 13:00"],
      telefono: "+598 2000 0000",
      whatsapp: "+598 99 000 000",
      email: "familias@crecer.example",
    },
    noticias: [
      { id: "n1", etiqueta: "Aviso", fijada: true, fecha: d(-1), titulo: "Cambio de horario el viernes 24", resumen: "Por jornada de capacitación, el viernes atendemos de 8:00 a 13:00.", cuerpo: "Por la jornada de capacitación del equipo, el viernes 24 atendemos de 8:00 a 13:00. Las sesiones de la tarde se reprograman: tu terapeuta te va a escribir por la app para coordinar.\n\nGracias por la comprensión." },
      { id: "n2", etiqueta: "Novedad", fecha: d(-4), titulo: "Llegaron los kits Kinima", resumen: "Ya estamos entregando los dispositivos para jugar en casa.", cuerpo: "Ya estamos entregando los kits Kinima a las familias que van a participar de las pruebas. Si tu terapeuta te lo indicó, pasá por recepción a retirarlo. La instalación lleva 10 minutos y te acompañamos en el proceso." },
      { id: "n3", etiqueta: "Comunidad", fecha: d(-9), titulo: "Gracias por la kermesse", resumen: "Juntamos fondos para la nueva sala de juegos.", cuerpo: "¡Gracias a todas las familias que vinieron a la kermesse! Juntamos fondos para equipar la nueva sala de juegos, que va a estar lista en diciembre." },
    ],
    eventos: [
      { id: "e1", fecha: d(5, 17), titulo: "Taller para familias: jugar en casa", lugar: "Salón principal", detalle: "Ideas simples para sumar movimiento a la rutina diaria." },
      { id: "e2", fecha: d(19, 10), titulo: "Fiesta de fin de año", lugar: "Patio del centro", detalle: "Para niños, familias y todo el equipo." },
    ],
    recursos: [
      { id: "r1", tipo: "guia", titulo: "Cómo preparar el espacio para jugar", descripcion: "Luz, distancia a la tele y espacio libre." },
      { id: "r2", tipo: "video", titulo: "Instalar el kit Kinima en 5 pasos", descripcion: "Video corto paso a paso." },
      { id: "r3", tipo: "guia", titulo: "Qué hacer si no quiere jugar", descripcion: "Ideas para acompañar sin presionar." },
    ],
    equipo: [
      { nombre: "Laura Pereira", rol: "Fisioterapeuta" },
      { nombre: "Martín Silva", rol: "Terapeuta ocupacional" },
      { nombre: "Recepción", rol: "Turnos y kits" },
    ],
  },

  andares: {
    slug: "andares",
    nombre: "Clínica Andares",
    nombreCorto: "Andares",
    tema: "coral",
    logo: null,
    iniciales: "A",
    ciudad: "Salto",
    bienvenida: "Tu espacio para seguir la rehabilitación desde casa, junto al equipo de Andares.",
    modulos: { mensajes: true, noticias: true, eventos: false, recursos: true, equipo: true },
    info: {
      direccion: "Calle Ejemplo 567, Salto",
      horarios: ["Lunes a viernes · 7:30 a 18:00"],
      telefono: "+598 4700 0000",
      whatsapp: null,
      email: "contacto@andares.example",
    },
    noticias: [
      { id: "n1", etiqueta: "Bienvenida", fijada: true, fecha: d(-2), titulo: "Empezamos con Kinima", resumen: "Este mes sumamos el juego en casa para algunas familias.", cuerpo: "Este mes empezamos a usar Kinima con algunas familias. Si tu hijo o hija participa, vas a ver la rutina del día en el inicio de esta app." },
      { id: "n2", etiqueta: "Aviso", fecha: d(-6), titulo: "Estacionamiento cerrado por obras", resumen: "Usá la entrada por la calle lateral hasta el 30.", cuerpo: "Hasta el 30 de este mes, el estacionamiento está cerrado por obras. La entrada al edificio es por la calle lateral." },
    ],
    eventos: [],
    recursos: [
      { id: "r1", tipo: "pdf", titulo: "Guía de bienvenida a Andares", descripcion: "Todo lo que necesitás saber para empezar." },
      { id: "r2", tipo: "video", titulo: "Instalar el kit Kinima", descripcion: "Video corto paso a paso." },
    ],
    equipo: [
      { nombre: "Ana Rodríguez", rol: "Fisioterapeuta" },
      { nombre: "Secretaría", rol: "Turnos" },
    ],
  },
};
