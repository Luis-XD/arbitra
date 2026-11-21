import FormRegister from '../components/FormRegister'
import styles from './css/Login.module.css'

function Register() {
    return ( 
        <section className={styles.page}>
            <div className={`container ${styles.layout}`}>
                <div className={styles.brand}>
                <img src="/logo.png" alt="Logo ARBITRA" />
                <h1>ARBITRA</h1>
                <p>Centro de Formación Profesional</p>
                </div>
                <div className={styles.panel}>
                    <FormRegister/>
                </div>
            </div>
        </section>
     )
}

export default Register