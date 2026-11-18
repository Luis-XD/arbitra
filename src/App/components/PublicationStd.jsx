import styles from './css/Publication.module.css'

function PublicationStd({children}) {
  let mediaSrc

  return (
    <>
      <div className={styles.publicationStd}>
        {children ? children : <p>No hay nada aqui</p>}
      </div>
    </>
  )
}

export default PublicationStd