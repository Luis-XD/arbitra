# Arbitra Gestión · módulo React

CRM + ERP para Arbitra Centro de Formación Profesional, empaquetado como una carpeta autocontenida
para sumar al frontend de un proyecto React existente.

- Componentes de función con hooks, en JSX.
- Un `.module.css` por componente (CSS Modules), sin estilos globales.
- Datos de ejemplo incluidos (`data/ejemplo/*.json`), que se pueden borrar desde **Ajustes**.
- La capa de datos es intercambiable: viene con un adaptador para `localStorage` y otro para una API REST.

## 1. Instalación

Copiá la carpeta `arbitra-gestion/` dentro de tu `src/` (por ejemplo, `src/modules/arbitra-gestion`) e instalá las dependencias:

```bash
npm install jspdf@^2.5.1 qrcode-generator@^1.4.4 \
  @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono @fontsource/bricolage-grotesque
```

| Dependencia | Para qué se usa |
|---|---|
| `react` / `react-dom` ≥ 18 | Se toman del proyecto anfitrión. |
| `jspdf` | PDF de recibos y certificados. Se carga con `import()` dinámico solo cuando hace falta. |
| `qrcode-generator` | Código QR del certificado. |
| `@fontsource/*` | Tipografías de la interfaz. Se importan en `ArbitraGestion.jsx`. |

Los archivos de `assets/` (logos, fondo del certificado y fuentes Montserrat) se referencian con
`new URL('../assets/…', import.meta.url)`. Vite, webpack 5 (Next.js, CRA 5) y Parcel lo resuelven sin configuración.

## 2. Uso

```jsx
import ArbitraGestion from './modules/arbitra-gestion';

export default function GestionPage() {
  return <ArbitraGestion usuario={{ id: 'u1', nombre: 'Laura', rol: 'admin' }} />;
}
```

Sin `adapter`, el módulo guarda los datos en el `localStorage` del navegador y arranca con los datos de ejemplo.

### Con datos compartidos (API REST)

```jsx
import ArbitraGestion, { createRestAdapter } from './modules/arbitra-gestion';

const adapter = createRestAdapter({
  baseUrl: '/api/arbitra',
  headers: () => ({ Authorization: `Bearer ${getToken()}` }),
});

<ArbitraGestion adapter={adapter} usuario={usuarioActual} usuarios={equipo} />;
```

Creá el adaptador fuera del componente, o con `useMemo`. Si cambia en cada render, los datos se vuelven a cargar.

### Next.js (App Router)

`ArbitraGestion.jsx` y los proveedores ya incluyen `'use client'`. Usalo desde una página o desde un componente cliente.

### Props de `<ArbitraGestion>`

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `adapter` | objeto | localStorage con ejemplos | Capa de datos (ver punto 3). |
| `usuario` | `{ id, nombre, rol }` | `{ id: 'local', rol: 'admin' }` | Usuario actual. |
| `usuarios` | `{ id, nombre }[]` | `[]` | Equipo, para mostrar quién registró cada cobro o cierre. |
| `tema` | `'auto' \| 'light' \| 'dark'` | `'auto'` | `auto` sigue la preferencia del sistema operativo. |
| `vistaInicial` | string | `'panel'` | Una de: `panel`, `prospectos`, `alumnos`, `cursos`, `inscripciones`, `asistencia`, `docentes`, `cobranzas`, `caja`, `reportes`, `ajustes`. |
| `onNavegar` | `(vista) => void` | — | Para sincronizar con el router del proyecto. |
| `sincronizarHash` | boolean | `false` | Refleja la vista en `location.hash` (`#cobranzas`). |
| `className` | string | — | Clase extra para el contenedor raíz. |

### Roles

| Rol | Permisos |
|---|---|
| `admin` (Editor) | Todo: ajustes, anular cobros, corregir cierres, restaurar respaldos y borrar ejemplos. |
| `colaborador` | Carga y cobra. No cambia ajustes ni anula cobros. Solo edita los movimientos de caja que cargó. |
| `lector` | Solo consulta. Puede descargar respaldos y exportaciones. |

Los permisos del frontend son una guía para la interfaz. La API debe validar el rol en cada escritura.

### Integración visual

- Todos los tokens de color, tipografía y radios se definen en la clase raíz (`ArbitraGestion.module.css`), no en `:root`, así que no pisan los estilos del proyecto.
- Las ventanas modales y los avisos se dibujan dentro del módulo (sin portales).
- El menú lateral es `sticky`. Si tu sitio tiene un encabezado fijo, indicá su alto en la variable `--ag-top`:

  ```css
  .miContenedor { --ag-top: 64px; }
  ```

  ```jsx
  <ArbitraGestion className={styles.miContenedor} />
  ```

## 3. Capa de datos (adaptadores)

Un adaptador es un objeto con estos métodos, todos asíncronos:

| Método | Devuelve | Uso |
|---|---|---|
| `cargar()` | `{ colecciones: { [col]: doc[] }, config, contadores }` | Carga inicial. |
| `guardar(col, doc)` | — | Alta o modificación (upsert por `doc.id`). |
| `eliminar(col, id)` | — | Borrado. |
| `guardarConfig(config)` | — | Ajustes del centro (objeto completo). |
| `siguienteNumero(tipo)` | número | Número correlativo **atómico** para `recibos` o `certificados`. |
| `fijarContador(tipo, ultimo)` | — | Fija el último número usado. |
| `subirArchivo(file)` *(opcional)* | `{ id, url, nombre }` | Comprobantes de pago. Si no existe, se oculta el campo. |
| `suscribir(cb)` *(opcional)* | función para desuscribir | Cambios en tiempo real: `cb({ coleccion, docs })`, `cb({ config })` o `cb({ contadores })`. |
| `eliminarLote(items)` / `guardarLote(items)` *(opcionales)* | — | Operaciones masivas. `items = [[col, id \| doc], …]`. |
| `descripcion` *(texto)* | — | Se muestra en el menú y en Ajustes. |

Colecciones: `cursos`, `docentes`, `prospectos`, `alumnos`, `inscripciones`, `caja`, `asistencia`, `evaluaciones`, `certificados`, `cierres`.

### Endpoints que espera `createRestAdapter`

| Método y ruta | Cuerpo / respuesta |
|---|---|
| `GET {baseUrl}/datos` | → `{ colecciones, config, contadores }` |
| `PUT {baseUrl}/colecciones/{col}/{id}` | documento JSON |
| `DELETE {baseUrl}/colecciones/{col}/{id}` | — |
| `PUT {baseUrl}/config` | objeto de configuración |
| `POST {baseUrl}/contadores/{tipo}/siguiente` | → `{ ultimo: 124 }`, incrementado en una transacción |
| `PUT {baseUrl}/contadores/{tipo}` | `{ ultimo }` |
| `POST {baseUrl}/archivos` | `multipart/form-data`, campo `archivo` → `{ id, url, nombre }` |

Las respuestas 401/403 se muestran como "sin permiso". Las 413 se muestran como "archivo demasiado grande".

### Pagos

Los pagos **no se guardan dentro de la inscripción**: se calculan a partir de los movimientos de `caja` con
`refTipo: 'cuota'`, `refId` (id de la inscripción) y `cuotaIdx`. Cada movimiento también guarda `aplicado` (lo que
cancela de la cuota) y `recargo`.

Así, dos personas pueden cobrar al mismo tiempo sin pisarse. Al anular un cobro, el movimiento queda en caja con
`anulado: true` y la cuota vuelve a quedar pendiente.

## 4. Estructura

```
arbitra-gestion/
├── index.js                    exportaciones públicas
├── ArbitraGestion.jsx/.css     raíz: tokens, tema, proveedores
├── assets/                     logos, fondo del certificado, fuentes del PDF
├── config/                     constantes, configuración inicial, rutas de assets
├── data/
│   ├── adapters/               localStorageAdapter, restAdapter
│   └── ejemplo/                datos de ejemplo (JSON)
├── lib/                        lógica pura: formato, negocio, WhatsApp, CSV, QR, PDF
├── state/                      DataProvider, UiProvider, useAcciones, useForm, buildDb
├── components/
│   ├── ui/                     Button, Field, Modal, Table, Panel, Kpi, Pill…
│   ├── layout/                 Shell, Sidebar, PageHeader
│   └── shared/                 ExampleBanner, CertificadoPreview, Timeline, AlumnoCampos…
├── views/                      una carpeta por pantalla (11)
└── modals/                     una carpeta por ventana (22)
```

`ModalHost` y los proveedores no tienen CSS porque no dibujan nada propio.

### Exportaciones de `index.js`

`default` / `ArbitraGestion`, `createLocalStorageAdapter`, `createRestAdapter`, `datosEjemplo`, `CONFIG_INICIAL`, `useData`, `useUi`.

## 5. WhatsApp

Los mensajes se abren con enlaces `wa.me` en el WhatsApp del equipo donde se trabaja. Para que salgan desde el número
del centro, usá WhatsApp Business (app o Web) con ese número en esa computadora o celular.

El número del centro, el código de área por defecto, el alias de pago y las plantillas se configuran en **Ajustes**.
Los teléfonos argentinos se normalizan solos: se quitan el 0 y el 15 y se agrega el 549.
