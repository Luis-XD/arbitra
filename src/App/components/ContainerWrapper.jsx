import styles from './css/ContainerWrapper.module.css';

function ContainerWrapper({ children, images }) {
    return (
        <section className={styles.fullWidthSection}>
            {/* Contenido interior (tus tarjetas, títulos, etc.) */}
            <div className={styles.innerContainer}>
                {children}
            </div>
            {/* Contenedor de las imágenes de fondo en bucle full screen */}
            <div className={styles.bgSliderContainer}>
                <div className={styles.opacityOverlay}></div>
                <img
                    key={1}
                    src={images}
                    alt="bgSlide"
                    className={styles.bgSlide}
                />
            </div>
        </section>
    )
}

export default ContainerWrapper;