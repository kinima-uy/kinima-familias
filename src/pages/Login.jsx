import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../lib/brand.jsx";
import { useCentro, LogoCentro } from "../lib/centro.jsx";
import { useSesion } from "../lib/auth.jsx";
import { USING_MOCK } from "../lib/api.js";
import { Formas, Icon } from "../components/ui.jsx";

export default function Login() {
  const centro = useCentro();
  const { sesion, entrar, slug } = useSesion();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  if (sesion) return <Navigate to={`/${slug}/inicio`} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !pass) return setError("Completá tu mail y tu contraseña.");
    setError(""); setCargando(true);
    try { await entrar(email, pass); nav(`/${slug}/inicio`, { replace: true }); }
    catch (err) { setError(err.message); setCargando(false); }
  };

  return (
    <div className="screen login">
      <header className="login-top">
        <Formas variante="b" />
        <div className="login-centro">
          <LogoCentro centro={centro} size={64} />
          <p className="eyebrow acc">Kinima Familias</p>
          <h1>{centro.nombre}</h1>
          <p>{centro.bienvenida}</p>
        </div>
      </header>
      <form className="login-form stack" onSubmit={submit} noValidate>
        <label className="field"><span>Mail</span><input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@mail.com" /></label>
        <label className="field"><span>Contraseña</span>
          <span className="pass">
            <input type={ver ? "text" : "password"} autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <button type="button" className="icon-btn" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={ver}><Icon name="ojo" size={20} /></button>
          </span>
        </label>
        {error && <p className="error" role="alert"><Icon name="alerta" size={16} />{error}</p>}
        <button className="btn btn-acc btn-block" disabled={cargando}>{cargando ? "Entrando…" : "Entrar"}</button>
        <p className="muted small center">¿No tenés cuenta? Te la da tu centro cuando empezás con Kinima.</p>
        {USING_MOCK && (
          <div className="demo-box">
            <b>Datos de prueba</b>
            <span>Mail: <code>familia@{slug}.uy</code> · Contraseña: <code>kinima2026</code></span>
            <button type="button" className="link-btn" onClick={() => { setEmail(`familia@${slug}.uy`); setPass("kinima2026"); }}>Completar automáticamente</button>
          </div>
        )}
        <div className="login-foot"><span>Con la tecnología de</span><Logo height={18} /></div>
        <Link className="link-btn center" to="/">No es mi centro</Link>
      </form>
    </div>
  );
}
