import styles from'./css/Form.module.css'
import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import Button from "./Button"
import LeftTopButton from "./LeftTopButton"
import ContFormInput from './ContFormInput'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import Loader from './Loader'
import { UserContext } from './UserProvider'
import TopButtons from './TopButtons'

function FormRegister() {
	const [ipAddress, setIpAddress] = useState('')
	const [cargando, setCargando] = useState(false)
	const navigate = useNavigate()
	const apiUrl = CONFIG_BACKEND.API_DIR
	const { user, setUser } = useContext(UserContext)
    const [campusStatus, setCampusStatus] = useState(null)

     const fetchCampusStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}/config/getDataConfig`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                if (data && data.result !== undefined) {
                    setCampusStatus(String(data.result.campusStatus))
                }
            }
        } catch (error) {
            console.error("Error al consultar el estado del campus:", error)
        }
    }

    useEffect(()=>{
        fetchCampusStatus()
    },[user])

    let valueCampus
    if (campusStatus === '0') {
        valueCampus = "⏳ Cerrada las inscripciones e inicios de sesión"
    }else if (campusStatus === '1') {
        valueCampus = "🕓 Solo para Profesores"
    }else if (campusStatus === '2') {
        valueCampus = "😀 Abiertas las inscripciones"
    }else if (campusStatus === '3') {
        valueCampus = "⌛ Inscripciones cerradas, solo login"
    }

	useEffect(() => {
		const fetchIp = async () => {
			try{
				const response = await fetch("https://api.ipify.org?format=json")
				const data = await response.json()
				setIpAddress(data.ip)
			} catch (error) {
				if (import.meta.env.DEV) { console.error("Error fetching IP address:", error)}
			}
		}

		fetchIp()
	}, [])

	const [form, setForm] = useState({
		names: "",
		lastNames: "",
		email: "",
		passw: "",
		sex: "",
		birthday: "",
		ipAddress: "",
		token: ""
	})
	
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		// 1. Validaciones previas (antes de activar el estado de carga)
		if (!emailRegex.test(form.email)) {
			alert("Email inválido")
			return
		}
		if (form.passw.length < 8) {
			alert("La contraseña debe tener al menos 8 caracteres")
			return
		}
		
		// 2. Activamos el spinner solo cuando pasamos las validaciones iniciales
    	setCargando(true)
		
		const formRegister = document.getElementById("formRegister")
		const alertContainer = document.getElementById('alertContainer')

		const userData = {
			names: event.target.names.value,
			lastNames: event.target.lastNames.value,
			email: event.target.email.value,
			passw: event.target.passw.value,
			sex: event.target.sex.value,
			birthday: event.target.birthday.value,
			ipAddress: ipAddress,
			token: event.target.token.value
		}
		alertContainer.style.padding="0.5em"

		try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/user/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            // Lee la respuesta como texto primero para ver qué llega exactamente
            const rawText = await response.text();

            if (!rawText) {
                throw new Error("El servidor respondió con un texto vacío.")
            }

            const data = JSON.parse(rawText);

            if (data.success) {
                alertContainer.style.backgroundColor = "#059c38";
                alertContainer.innerHTML = "✅ " + data.message;
                setTimeout(() => navigate(CONFIG_PATHS.LOGIN_PATH), 8000);
            } else {
                alertContainer.style.backgroundColor = "#f00";
                alertContainer.innerHTML = "❌ " + (data.message || "Error desconocido");
                formRegister.reset();
                setTimeout(() => {
                    alertContainer.innerHTML = "";
                    alertContainer.style.padding = "";
                }, 10000)
            }
        } catch (errorCatch) {
            if (import.meta.env.DEV) { console.error("❌ Error en api:", errorCatch); }
            alertContainer.innerHTML = "❌ " + errorCatch.message;
            alertContainer.style.backgroundColor = "#f00";
            setTimeout(() => {
                formRegister.reset();
                alertContainer.innerHTML = "";
                alertContainer.style.padding = "";
            }, 6000)
		}finally {
			// 3. Se ejecuta SIEMPRE al terminar el bloque try/catch
			setCargando(false)
		}
	}

	return (
		<>
		{!campusStatus ? (''):(
			<div className={styles.contForm}>
				{campusStatus === '0' || campusStatus === '3' ? (
					<>
					<div className={styles.container}>
						<TopButtons>
							<LeftTopButton text="Login" locationElm={CONFIG_PATHS.LOGIN_PATH} typeElm='expand'/>
						</TopButtons>
						<h2 style={{color:'green', padding:'0.5rem'}}>{valueCampus}</h2>
					</div>
					</>
				):(
				<form className={styles.form} id='formRegister' onSubmit={campusStatus === '1' || campusStatus === '2' && handleSubmit} >
					<div className={styles.alertContainer} id="alertContainer"></div>
					<h2>Regístrate</h2>
					<p style={{color:'green', padding:'0.5rem'}}>{valueCampus}</p>
					<ContFormInput nameElm="Nombre/s :">
						<input type='text' name='names' value={form.names} id='name' placeholder="Nombres" onChange={handleChange} required />
					</ContFormInput>

					<ContFormInput nameElm="Apellido/s :">
						<input type='text' name='lastNames' value={form.lastNames} id='lastNames' placeholder="Apellidos" onChange={handleChange} required />
					</ContFormInput>

					<ContFormInput nameElm="Email :">
						<input type='text' name='email' value={form.email} id='email' placeholder="Email" onChange={handleChange} required />
					</ContFormInput>

					<ContFormInput nameElm="Contraseña : * Min. 8 caracteres">
						<input type='password' name='passw' value={form.passw} id='passwordRegister' placeholder="Contraseña" onChange={handleChange} required />
					</ContFormInput>
					
					<ContFormInput nameElm="Sexo :">
						<div className={styles.radio}>
							<label>
								<input type='radio' name='sex' value='M' id='masculino' onChange={handleChange} required />
								Masculino
							</label>

							<label>
								<input type='radio' name='sex' value='F' id='femenino' onChange={handleChange} required />
								Femenino
							</label>
						</div>
					</ContFormInput>

					<ContFormInput nameElm="Fecha de nac. :">
						<input type='date' name='birthday' value={form.birthday} id='birthday' onChange={handleChange} required />
					</ContFormInput>

					<ContFormInput nameElm="Código de registro :">
						<input type='password' name='token' value={form.token} id='token' placeholder="Lo proporciona administración" onChange={handleChange} autoComplete="off" required />
					</ContFormInput>

					<ContFormInput className={styles.btn}>
						<Button
							type='submit'
							altName='Registrarme'
							title="Restrarme"
							styleBtn={1}
							disabled={cargando}
						>
							{cargando ? <Loader mini={true}/> : "Registrarme"}
						</Button>
					</ContFormInput>
					<p className={styles.smallText}>Ya tengo una cuenta, ir a<Link to='/login'>inicio de sesión</Link></p>
				</form>
				)}
			</div>
		)}
		</>
	)
}

export default FormRegister