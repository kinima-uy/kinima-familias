import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import * as apiCentroAdmin from "./apiCentroAdmin.js";

const AuthCentroAdminCtx = createContext(null);
const KEY = "kinima-centro-admin-sesion";

function leer() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } }
function escribir(v) { try { v ? sessionStorage.setItem(KEY, JSON.stringify(v)) : sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } }

export function AuthCentroAdminProvider({ children }) {
  const [centroAdmin, setCentroAdmin] = useState(leer);
  const entrar = async (email, password) => {
    const c = await apiCentroAdmin.entrar(email, password);
    setCentroAdmin(c); escribir(c);
    return c;
  };
  const salir = () => { apiCentroAdmin.salir(); setCentroAdmin(null); escribir(null); };
  useEffect(() => {
    const vencida = () => { setCentroAdmin(null); escribir(null); };
    addEventListener("kinima:centro-admin-sesion-vencida", vencida);
    return () => removeEventListener("kinima:centro-admin-sesion-vencida", vencida);
  }, []);
  return <AuthCentroAdminCtx.Provider value={{ centroAdmin, entrar, salir }}>{children}</AuthCentroAdminCtx.Provider>;
}

export const useAuthCentroAdmin = () => useContext(AuthCentroAdminCtx);

export function RequireCentroAdmin({ children }) {
  const { centroAdmin } = useAuthCentroAdmin();
  const loc = useLocation();
  if (!centroAdmin) return <Navigate to="/centro-admin/ingresar" replace state={{ from: loc.pathname }} />;
  return children;
}
