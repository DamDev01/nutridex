import type { Metadata } from "next";
import "./globals.css";
import "./food-ui.css";
export const metadata: Metadata = { title: "NutriDex · Gestão nutricional", description: "Sua prática clínica, em perspectiva. Pacientes, agenda e planejamento nutricional." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: "(function(){var t='light';try{t=localStorage.getItem('nutridex-theme')||'light'}catch(e){}var d=t==='dark';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.dataset.theme=d?'dark':'light'})();"}} /></head><body>{children}</body></html>; }
