// Adaptador para un backend propio por HTTP/JSON. Los endpoints esperados están
// descritos en el README. Ajustá las rutas acá si tu API usa otras.

/**
 * @param {object} opciones
 * @param {string} opciones.baseUrl  por ejemplo "/api/arbitra"
 * @param {() => Record<string,string> | Promise<Record<string,string>>} [opciones.headers]  token de sesión, etc.
 * @param {typeof fetch} [opciones.fetch]
 */
export function createRestAdapter({ baseUrl, headers, fetch: fetchImpl } = {}) {
  if (!baseUrl) throw new Error('createRestAdapter: falta baseUrl');
  const f = fetchImpl || ((...a) => fetch(...a));
  const base = baseUrl.replace(/\/$/, '');

  async function pedir(ruta, { method = 'GET', body, json = true } = {}) {
    const h = { ...(headers ? await headers() : {}) };
    if (json && body !== undefined) h['Content-Type'] = 'application/json';
    const res = await f(`${base}${ruta}`, { method, headers: h, body: json && body !== undefined ? JSON.stringify(body) : body, credentials: 'include' });
    if (!res.ok) {
      const err = new Error(`Error ${res.status} en ${method} ${ruta}`);
      err.status = res.status; throw err;
    }
    return res.status === 204 ? null : res.json().catch(() => null);
  }

  return {
    descripcion: 'Datos compartidos del equipo',
    /** GET /datos → { colecciones: {cursos:[], ...}, config: {}, contadores: {} } */
    cargar: () => pedir('/datos'),
    guardar: (col, doc) => pedir(`/colecciones/${col}/${encodeURIComponent(doc.id)}`, { method: 'PUT', body: doc }),
    eliminar: (col, id) => pedir(`/colecciones/${col}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    guardarConfig: (config) => pedir('/config', { method: 'PUT', body: config }),
    /** Debe incrementar en forma atómica en el servidor y devolver { ultimo }. */
    siguienteNumero: async (tipo) => (await pedir(`/contadores/${tipo}/siguiente`, { method: 'POST', body: {} })).ultimo,
    fijarContador: (tipo, ultimo) => pedir(`/contadores/${tipo}`, { method: 'PUT', body: { ultimo } }),
    /** POST multipart con el campo "archivo" → { id, url, nombre } */
    subirArchivo: async (file) => {
      const fd = new FormData(); fd.append('archivo', file);
      return pedir('/archivos', { method: 'POST', body: fd, json: false });
    },
  };
}
