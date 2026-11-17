import styles from './css/ManageGeneral.module.css'
import ArbitraGestion from '../../../libs/gestion/ArbitraGestion'

function ManageGeneral() {
    return ( 
        <>
        <div className={styles.container}>
            <ArbitraGestion />
        </div>
        </>
     )
}

export default ManageGeneral