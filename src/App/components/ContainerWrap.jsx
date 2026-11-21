import styles from './css/ContainerWrap.module.css'

function ContainerWrap({children}) {
    return ( <div className={styles.wrap} >{children}</div> );
}

export default ContainerWrap;