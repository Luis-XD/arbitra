import styles from './css/TopTitle.module.css'

function TopTitle({header="", wordOne="", wordTwo="", paragraph="", subtitle=""}) {
    return ( 
        <div className={styles.formationTop}>
            <p className={styles.eyebrow}>
              {header}
            </p>
            <h2 id="formTitle">
              {wordOne} <span className="green">{wordTwo}</span>
            </h2>
            <p>
              {paragraph}
            </p>
            <span className={styles.subtitle}>{subtitle}</span>
        </div>
     );
}

export default TopTitle;