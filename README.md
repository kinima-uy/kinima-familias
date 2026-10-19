# Kinima Familias

App para las familias, **multicentro** (como Moodle): una sola app con el diseño de Kinima, y cada centro con su propio espacio, su contenido y algunos detalles visuales.
Dirección prevista: **familias.kinima.uy/<centro>** (por ejemplo `familias.kinima.uy/crecer`).

> Versión de diseño con **datos de prueba**. Centros inventados: `crecer` y `andares`.
> Familias de prueba: `familia@crecer.uy` y `familia@andares.uy` · contraseña `kinima2026`.

## Qué es de Kinima y qué es de cada centro
| Siempre igual (Kinima) | Lo configura cada centro |
|---|---|
| Tipografías, componentes, estructura, accesibilidad | Nombre, nombre corto, logo o iniciales |
| Rutina del día, progreso, logros, "¿cómo se sintió?" | Color de acento (de una lista aprobada de la paleta Kinima) |
| El juego y la consola | Mensaje de bienvenida |
| | Noticias, eventos, guías y recursos, equipo, horarios y contacto |
| | Qué secciones están activas (mensajes, noticias, eventos, recursos, equipo) |

## Pantallas
| Ruta | Pantalla |
|---|---|
| `/` | Entrada: código del centro |
| `/:centro` | Login con la identidad del centro |
| `/:centro/inicio` | Rutina de hoy, "¿cómo se sintió?", semana, mensaje del profesional, novedades del centro |
| `/:centro/progreso` | Anillo de la semana, racha, minutos, logros, calendario del mes |
| `/:centro/mensajes` | Chat con el profesional |
| `/:centro/centro` | Mi centro: contacto, noticias, eventos, recursos, horarios, equipo |
| `/:centro/perfil` | Cuenta, hijos, recordatorio diario, cerrar sesión |
| `/:centro/panel` | **Demo** del panel del centro. En el producto final va dentro del portal profesional, solo para administradores |

## Archivos clave
- `src/data/centros.js` — configuración de cada centro y lista de colores aprobados (`TEMAS`).
- `src/lib/centro.jsx` — carga el centro según la dirección y aplica su color.
- `src/lib/api.js` — capa de datos (hoy de prueba). Con la API real, todo va "dentro" de un centro: `GET /centros/:slug`, `GET /centros/:slug/familia/hoy`…

## Base de datos (para la API)
- Tabla `centros` (slug, nombre, logo, tema, bienvenida, módulos, info de contacto).
- Todas las demás tablas (familias, pacientes, profesionales, noticias, eventos, recursos, mensajes) llevan `centro_id`.
- La API filtra **siempre** por el centro de quien está logueado: una familia o un profesional nunca ven datos de otro centro.
