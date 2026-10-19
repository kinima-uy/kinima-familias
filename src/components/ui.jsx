/* Piezas visuales de la app de familias, tomadas del moodboard: formas orgánicas, caritas para el
   "¿cómo se sintió?", anillo de la semana en segmentos e insignias con formas. Todo en la paleta Kinima. */
import { COLORS } from "../lib/brand.jsx";
import { MINGCUTE } from "../lib/mingcute.js";

/* Íconos: MingCute, la familia iconográfica de Kinima (manual de marca, p. 35). */
export function Icon({ name, size = 22, stroke, ...rest }) {
  const d = MINGCUTE[name];
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true" {...rest}>{d && d.map((x, i) => <path key={i} d={x} />)}</svg>;
}

/* Formas sueltas de fondo (blobs, garabatos, confeti), como en el moodboard. */
export function Formas({ variante = "a" }) {
  const c = [COLORS.teal, COLORS.yellow, COLORS.coral];
  return (
    <svg className={`formas formas-${variante}`} viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M300,-20 C370,-10 420,60 380,120 C350,170 280,150 260,100 C240,50 240,-30 300,-20Z" fill={c[1]} opacity=".55" />
      <path d="M-30,190 C20,150 90,170 100,220 C110,270 40,300 0,280 C-40,260 -60,220 -30,190Z" fill={c[0]} opacity=".35" />
      <path d="M170,40 q20,-25 40,0 t40,0 t40,0" stroke={c[2]} strokeWidth="6" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M40,60 c10,-30 40,-20 30,5 s-30,25 -10,40" stroke={c[0]} strokeWidth="6" fill="none" strokeLinecap="round" opacity=".6" />
      <circle cx="240" cy="200" r="9" fill={c[2]} opacity=".6" />
      <rect x="120" y="120" width="16" height="16" rx="4" transform="rotate(20 128 128)" fill={c[1]} opacity=".7" />
      <path d="M330,230 l10,-18 l10,18z" fill={c[0]} opacity=".55" />
      <circle cx="90" cy="20" r="5" fill={c[1]} />
    </svg>
  );
}

/* Caritas para "¿cómo se sintió?" (inspiradas en el check-in del moodboard de niños). */
export const ANIMOS = [
  { id: "contento", t: "Contento", fill: COLORS.yellow, cara: "M14,30 q10,10 20,0", ojos: "feliz" },
  { id: "bien", t: "Bien", fill: COLORS.teal, cara: "M15,31 q9,5 18,0", ojos: "punto" },
  { id: "cansado", t: "Cansado", fill: "#B8C7D6", cara: "M17,32 h14", ojos: "cerrado" },
  { id: "dolor", t: "Le molestó", fill: COLORS.coral, cara: "M14,33 q5,-5 10,0 t10,0", ojos: "punto" },
];
const BLOBS = {
  contento: "M24,3 C36,2 46,12 45,25 C44,38 34,46 22,45 C10,44 2,35 3,23 C4,11 12,4 24,3Z",
  bien: "M25,2 C38,4 47,14 44,28 C41,41 29,47 17,43 C6,39 1,28 4,17 C7,7 14,1 25,2Z",
  cansado: "M8,10 C16,2 34,3 41,10 C48,18 46,34 39,40 C31,46 15,46 8,39 C2,32 1,17 8,10Z",
  dolor: "M24,2 L30,8 L40,6 L41,16 L47,24 L41,32 L42,42 L31,41 L24,47 L17,41 L6,42 L7,32 L1,24 L7,16 L8,6 L18,8Z",
};
export function Carita({ animo, size = 56 }) {
  const a = ANIMOS.find((x) => x.id === animo);
  if (!a) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d={BLOBS[animo]} fill={a.fill} />
      {a.ojos === "feliz" && <path d="M14,20 q3,-4 6,0 M28,20 q3,-4 6,0" stroke="#19324A" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      {a.ojos === "punto" && <><circle cx="17" cy="20" r="2.6" fill="#19324A" /><circle cx="31" cy="20" r="2.6" fill="#19324A" /></>}
      {a.ojos === "cerrado" && <path d="M13,21 h7 M28,21 h7" stroke="#19324A" strokeWidth="2.6" strokeLinecap="round" />}
      <path d={a.cara} stroke="#19324A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* Anillo de la semana en segmentos: un segmento por día de rutina (lleno si jugó). */
export function AnilloSemana({ dias, size = 150, children }) {
  const toca = dias.filter((d) => d.toca);
  const n = toca.length || 1, r = size / 2 - 12, c = size / 2, gap = 14;
  const arc = (i) => {
    const a0 = -90 + (360 / n) * i + gap / 2, a1 = -90 + (360 / n) * (i + 1) - gap / 2;
    const p = (a) => [c + r * Math.cos((a * Math.PI) / 180), c + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`;
  };
  const colores = [COLORS.teal, COLORS.yellow, COLORS.coral];
  return (
    <div className="anillo" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        {toca.map((d, i) => <path key={i} d={arc(i)} stroke={d.jugo ? colores[i % 3] : "#E4E0D6"} strokeWidth="14" strokeLinecap="round" fill="none" />)}
      </svg>
      <div className="anillo-in">{children}</div>
    </div>
  );
}

/* Insignias (logros) con formas del moodboard. */
const FORMAS = {
  estrella: "M24,3 L30,17 L45,18 L33,28 L37,43 L24,35 L11,43 L15,28 L3,18 L18,17Z",
  rayo: "M27,2 L9,27 L22,27 L18,46 L39,18 L26,18Z",
  sol: "M24,6 a18,18 0 1,0 0.1,0Z",
  corazon: "M24,43 C10,33 3,25 4,16 C5,8 15,4 24,13 C33,4 43,8 44,16 C45,25 38,33 24,43Z",
  flor: "M24,4 C30,4 31,12 28,16 C33,12 41,14 41,20 C41,26 33,27 29,25 C33,29 32,38 26,39 C20,40 19,32 20,28 C16,32 8,32 7,26 C6,20 14,18 18,20 C14,16 16,4 24,4Z",
};
export function Insignia({ forma, ok, size = 64, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d={FORMAS[forma]} fill={ok ? color : "none"} stroke={ok ? color : "#CFC9BB"} strokeWidth="2" strokeDasharray={ok ? "" : "4 4"} strokeLinejoin="round" />
    </svg>
  );
}

export const Cargando = () => <div className="cargando" role="status"><span className="spin" aria-hidden="true" />Cargando…</div>;
