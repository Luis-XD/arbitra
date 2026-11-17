import FormConfigEdit from '../../components/FormConfigEdit'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONFIG_PATHS } from '../../config/config'
import { UserContext } from '../../components/UserProvider'

function ConfigurationEdit() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    
    useEffect(() => {
        if (user && user.roleId !== 1) {
            navigate(CONFIG_PATHS.CAMPUS_PATH, { replace: true })
        }
    }, [user, navigate])

    return ( 
        <>
            { user.roleId === 1 && <FormConfigEdit /> }
        </>
    )
}

export default ConfigurationEdit