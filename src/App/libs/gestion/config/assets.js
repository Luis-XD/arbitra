// Rutas de los archivos binarios del módulo.
// `new URL(..., import.meta.url)` lo resuelven Vite, webpack 5 (Next.js, CRA 5) y Parcel
// sin configuración extra, y copian el archivo al build.

export const ASSETS = {
  logo: new URL('../assets/logo-marca.png', import.meta.url).href,
  logoOscuro: new URL('../assets/logo-marca-oscura.png', import.meta.url).href,
  certificadoFondo: new URL('../assets/certificado-fondo.jpg', import.meta.url).href,
  fuenteMedium: new URL('../assets/fonts/Montserrat-Medium.ttf', import.meta.url).href,
  fuenteBold: new URL('../assets/fonts/Montserrat-Bold.ttf', import.meta.url).href,
};
