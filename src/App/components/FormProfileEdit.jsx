import styles from './css/Form.module.css'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from './UserProvider'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import LeftTopButton from './LeftTopButton'
import Loader from './Loader'
import ContFormInput from './ContFormInput'
import ShowData from './ShowData'
import { CONFIG_BACKEND, CONFIG_PATHS } from '../config/config'
import userDefault from '/iconsArbitra/utilities/user_128.png'
import TopButtons from './TopButtons'

function FormProfileEdit() {
    const { user, loadUser } = useContext(UserContext)
    const [preview, setPreview] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)
    const [message, setMessage] = useState("")
    const [form, setForm] = useState({
        names: user?.names || '',
        lastNames:  user?.lastNames || '',
        dni:  user?.dni || '',
        sex:  user?.sex || '',
        birthday:  user?.birthday || '',
        aboutMe:  user?.aboutMe || ''
    })
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) =>{
        const file = e.target.files[0]
        setSelectedImage(file)

        const reader = new FileReader()
        reader.onloadend = ()=>{
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setCargando(true)
        const alertContainer = document.getElementById('alertContainer')

        const formData = new FormData()
        formData.append('names', form.names)
        formData.append('lastNames', form.lastNames)
        formData.append('dni', form.dni)
        formData.append('sex', form.sex)
        formData.append('birthday', form.birthday)
        formData.append('imgProfile', selectedImage)
        formData.append('aboutMe', form.aboutMe)

        alertContainer.style.padding="0.5rem"

        try {
            const response = await fetch(`${CONFIG_BACKEND.API_DIR}/user/update`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()

            if(data.success){
                alertContainer.classList.add("success")
                setMessage("✅ ¡"+data.message+"!")
                await loadUser()
                setTimeout(() => {
                    navigate(CONFIG_PATHS.CAMPUS_PATH+"/"+CONFIG_PATHS.CAMPUS_PROFILE_PATH)
                }, 3000);
            }else{
                alertContainer.classList.add("error")
                setMessage("❌ ¡"+data.error+"!")
            }
        } catch (errorCatch) {
            if (import.meta.env.DEV) { console.error("❌ Error en api:", errorCatch)}
            alertContainer.classList.add("error")
            setMessage("❌ ¡"+errorCatch.error+"!")
        } finally{
            setCargando(false)
            await loadUser()
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    let imgResult

    if(preview){
        imgResult = preview
    }else if(!preview){
        imgResult = userDefault
    }

    if (!user){
        return <Loader />
    }
    
    return ( 
        <>
            <div className={styles.contForm}>
                <form className={styles.form} id='formUpdate' onSubmit={handleSubmit}>
                    <div className={styles.alertContainer} id="alertContainer">{message}</div>
                    <TopButtons>
                        <LeftTopButton typeElm='expand' text="Perfil" locationElm="/campus/perfil"/>
                    </TopButtons>
                    
                    <div className={styles.contElmsForm}>
                        <h1>Editar perfil</h1>
                        <ContFormInput nameElm="Nombre">
                            <input type="text" name="names" placeholder={user?.names} onChange={handleChange}/>
                        </ContFormInput>

                        <ContFormInput nameElm="Apellidos">
                            <input type="text" name="lastNames" placeholder={user?.lastNames} id="apellidos" onChange={handleChange}/>
                        </ContFormInput>

                        <ContFormInput nameElm="DNI">
                            <input type="text" name="dni" placeholder={user?.dni} id="dni" onChange={handleChange}/>
                        </ContFormInput>

                        <ContFormInput nameElm="Email:" iconElm="?" titleElm='No se puede cambiar este valor'>
                            <ShowData>{user?.email}</ShowData>
                        </ContFormInput>

                        <ContFormInput nameElm="Contraseña:" iconRoute='/iconsArbitra/links/external-link.png'>
                            <Link to={`${CONFIG_PATHS.CAMPUS_PATH}/${CONFIG_PATHS.CAMPUS_CONFIG_PASSW}`}>
                                <ShowData>Cambiar mi contraseña</ShowData>
                            </Link>
                        </ContFormInput>

                        <ContFormInput nameElm="Sexo">
                            <div className={styles.radio}>
                                <label>
                                    <input type="radio" name="sex" value='M' id="masculino" onChange={handleChange}/>
                                    Masculino
                                </label>

                                <label>
                                    <input type="radio" name="sex" value='F' id="femenino" onChange={handleChange}/>
                                    Femenino
                                </label>
                            </div>
                        </ContFormInput>

                        <ContFormInput nameElm="Fecha de nac.">
                            <input type="date" name="birthday" placeholder={form.birthday} id="birthday" onChange={handleChange}/>
                        </ContFormInput>

                        <ContFormInput nameElm="Acerca de mi">
                            <textarea id="aboutMe" name="aboutMe" placeholder={user.aboutMe} onChange={handleChange}></textarea>
                        </ContFormInput>

                        <ContFormInput nameElm="Imagen de perfil">
                            <div className={styles.contImgUpPreview}>
                                <img src={imgResult} alt="Imagen de perfil" id='imgUserPreview' />
                                <input type="file" name="imgProfile" alt="Imagen de perfil" accept="image/*" onChange={handleImageChange}/>
                            </div>
                        </ContFormInput>
                        
                        <Button
                            typeBtn="submit"
                            altName="Guardar cambios"
                            title="Guardar cambios"
                            styleBtn={2}
                            id="guadarCambios"
                            disabled={cargando}
                        >
                            {cargando ? <Loader mini={true}/> : "Guardar cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
     )
}

export default FormProfileEdit