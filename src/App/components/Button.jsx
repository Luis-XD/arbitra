import styles from './css/Button.module.css'

function Button({typeBtn, altName, titleBtn, children, styleBtn="", disabled=false, onClick}) {
    return ( 
        <>
            <button 
                type={typeBtn} 
                onClick={onClick}
                alt={altName} 
                name={altName} 
                title={!disabled ? titleBtn : 'Nada para descargar'} 
                disabled={disabled} 
                style={{ backgroundColor: disabled &&'#333'}}
                className={
                    styleBtn === 1 ? styles.button : (styleBtn === 2 ? styles.button2 : styles.buttonHome)
                } 
            >
                {children}
            </button>
        </>
     )
}

export default Button