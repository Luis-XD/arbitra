import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FormProfileEdit from '../../components/FormProfileEdit'
import { UserContext } from '../../components/UserProvider'
import { CONFIG_PATHS } from '../../config/config'

function ProfileEdit() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
        if (!user){
            navigate(CONFIG_PATHS.LOGIN_PATH, { state: { updated: true } })
        }
    },[])

    return ( <FormProfileEdit/> )
}

export default ProfileEdit