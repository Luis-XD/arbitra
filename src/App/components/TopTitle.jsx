import styles from './css/TopTitle.module.css'

function TopTitle({header="", wordOne="", wordTwo="", paragraph="", subtitle="", dark=false}) {
    return ( 
        <div className={styles.formationTop}>
            <p className={styles.eyebrow}>
              {header}
            </p>
            <h2 id="formTitle" className={dark && styles.dark}>
              {wordOne} <span className="green">{wordTwo}</span>
            </h2>
            <p className={styles.subtitle}>
              {paragraph}
            </p>
        </div>
     );
}

export default TopTitle;