import styles from './css/ContFormInput.module.css'

function ContFormInput({ nameElm, titleElm = "", iconElm = "", children, className = "", iconRoute="" }) {
    const iconAlert = iconElm ? iconElm : null

    return ( 
        <div className={`${styles.contFormInput} ${className}`} title={titleElm ? titleElm : ""}>
            <label>
                <p className={styles.nameElm}>
                    {nameElm}
                    {iconAlert && (
                        <span>{iconAlert}</span>
                    )}
                    {iconRoute && <img src={iconRoute} title='Nueva ventana'/>}
                </p>
                {children}
            </label>
        </div>
    )
}

export default ContFormInput