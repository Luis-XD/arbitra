import ShowConfigData from '../../components/ShowConfigData'
import { useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CONFIG_PATHS } from '../../config/config'
import { UserContext } from '../../components/UserProvider'

function Configuration() {    
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.state?.updated) {
            loadUser()
        }
    }, [location.state])

    useEffect(()=>{
        if(user && user.roleId !== 1){
            navigate(CONFIG_PATHS.HOME_PATH)
        }
    },[user, navigate])

    if (!user) {
        return null
    }

    return ( <ShowConfigData /> )
}

export default Configuration