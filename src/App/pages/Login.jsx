import FormLogin from '../components/FormLogin'
import styles from './css/Login.module.css'

function Login() {
    return ( 
           <section className={styles.page}>
            <div className={`container ${styles.layout}`}>
                <div className={styles.brand}>
                <img src="/logo.png" alt="Logo ARBITRA" />
                <h1>ARBITRA</h1>
                <p>Centro de Formación Profesional</p>
                </div>
                <div className={styles.panel}>
                    <FormLogin />
                </div>
            </div>
        </section>
     )
}

export default Login