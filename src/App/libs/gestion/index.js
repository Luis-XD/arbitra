// Punto de entrada del módulo Arbitra Gestión.
export { default, default as ArbitraGestion } from './ArbitraGestion';
export { createLocalStorageAdapter } from './data/adapters/localStorageAdapter';
export { createRestAdapter } from './data/adapters/restAdapter';
export { datosEjemplo } from './data/ejemplo';
export { CONFIG_INICIAL } from './config/defaults';
export { useData } from './state/DataProvider';
export { useUi } from './state/UiProvider';
