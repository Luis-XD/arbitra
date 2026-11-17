import styles from './css/ContentTextLand.module.css'
import Button from './Button'
import { CONFIG_PATHS } from '../config/config'
import { useNavigate } from 'react-router-dom'

function ContentTextLand() {
    const navigate = useNavigate()

    return ( 
        <div className={styles.contentTextLand}>
            <div className={styles.cont}>
                <h1>Centro de formación profesional</h1>
                <div className={styles.contButton}>
                    <Button styleBtn={'home'}>Explora el programa</Button>
                    <Button styleBtn={2} onClick={() => navigate(CONFIG_PATHS.CAMPUS_PATH)}>Ve nuestro campus virtual</Button>
                </div>
            </div>
        </div>
    )
}

export default ContentTextLand;