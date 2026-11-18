import styles from './css/SectionExpand.module.css'

function SectionExpand({children, bgAssing="", pdgAssign="", titleElm=""}) {
    return ( 
        <div className={styles.sectionExpand} style={{backgroundColor:bgAssing, padding:pdgAssign}}>
            {titleElm && <h2>{titleElm}</h2>}
            {children}
        </div>
     );
}

export default SectionExpand;