import styles from './Button.module.css';

/**
 * Botón o enlace con aspecto de botón.
 * @param {'default'|'primary'|'danger'|'dangerSolid'|'ghost'|'wa'|'waGhost'} [variant]
 * @param {'md'|'sm'} [size]
 * @param {string} [href]  si se indica, renderiza un <a> que abre en otra pestaña
 */
export default function Button({ variant = 'default', size = 'md', href, className = '', type = 'button', children, ...rest }) {
  const cls = [styles.btn, styles[variant], size === 'sm' ? styles.sm : '', className].filter(Boolean).join(' ');
  if (href) {
    return <a className={cls} href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
  }
  return <button type={type} className={cls} {...rest}>{children}</button>;
}
