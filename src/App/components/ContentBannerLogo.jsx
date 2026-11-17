import styles from './css/ContentBannerLogo.module.css'

function ContentBannerLogo() {
    return ( 
        <div className={styles.container}>
            <div className={styles.contImg}>
                <img src="/logo.png" />
            </div>
            <div className={styles.contText}>
                <h2>ARBITRA</h2>
                <p>Centro de Formación Profesional</p>
            </div>
        </div>
     )
}

export default ContentBannerLogo