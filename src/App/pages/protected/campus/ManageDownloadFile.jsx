import styles from './css/ManageGeneral.module.css'
import ManageFiles from '../../../components/ManageFiles'

function ManageDownloadFile() {
    return ( 
        <>
        <div className={styles.container}>
            <ManageFiles />
        </div>
        </>
     )
}

export default ManageDownloadFile