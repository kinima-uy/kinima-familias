import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Logo, K_PATH, COLORS } from "../lib/brand.jsx";
import { useAuthCentroAdmin } from "../lib/authCentroAdmin.jsx";
import { Icon } from "../components/ui.jsx";

function Petalo({ color, width, left, top, rotate, opacity = 1 }) {
  return (
    <svg viewBox="175 415 175 250" aria-hidden="true" className="familia-login-shape"
      style={{ width, height: width * 1.43, left, top, transform: `rotate(${rotate}deg)`, opacity }}>
      <path fill={color} d={K_PATH} />
    </svg>
  );
}

export default function CentroAdminLogin() {
  const { centroAdmin, entrar } = useAuthCentroAdmin();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (centroAdmin) return <Navigate to={loc.state?.from || "/centro-admin"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !pass) { setError("Completá el mail y la contraseña."); return; }
    setError(""); setCargando(true);
    try { await entrar(email, pass); nav(loc.state?.from || "/centro-admin", { replace: true }); }
    catch (err) { setError(err.message); setCargando(false); }
  };

  return (
    <div className="familia-login">
      <Petalo color={COLORS.teal} width={260} left={-90} top={-60} rotate={-10} opacity={0.9} />
      <Petalo color={COLORS.yellow} width={160} left="78%" top={40} rotate={70} opacity={0.9} />
      <Petalo color={COLORS.coral} width={200} left="68%" top={520} rotate={150} opacity={0.85} />

      <div className="familia-login-top">
        <div className="f-logo"><Logo height={30} /></div>
        <h1>Panel del centro</h1>
        <p>Noticias, eventos e información del centro para las familias.</p>
      </div>

      <form className="familia-card" onSubmit={submit} noValidate>
        <p className="eyebrow">Cuenta de centro</p>
        <label className="f-field">
          <span>Mail</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error && !email} placeholder="centro@mail.com" />
        </label>
        <label className="f-field">
          <span>Contraseña</span>
          <span className="f-pass">
            <input type={ver ? "text" : "password"} autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} aria-invalid={!!error && !pass} />
            <button type="button" className="icon-btn" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={ver}><Icon name="ojo" size={18} /></button>
          </span>
        </label>

        {error && <p className="form-error" role="alert"><Icon name="alerta" size={16} />{error}</p>}

        <button className="btn-grad" disabled={cargando}>{cargando ? "Ingresando…" : <>Ingresar <Icon name="flecha" size={18} /></>}</button>
        <p className="familia-hint">¿No tenés cuenta todavía? Pedísela al administrador del centro en Kinima.</p>
        <p className="familia-foot"><Icon name="candado" size={14} />Conexión segura · Acceso solo para cuentas de centro</p>
        <Link to="/ingresar" className="familia-staff-link">¿Sos familia de un paciente? Entrá por acá</Link>
      </form>
    </div>
  );
}
