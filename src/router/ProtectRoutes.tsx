// build-in
import { useEffect } from 'react'
// external
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// internal
import { UserServices } from '@/services/api/hospital/user'
import { AuthLocalStorage } from '@/services/localStorage/auth'
import { timerSwal } from '@/utils/sweetAlert'
import { UserLocalStorage } from '@/services/localStorage/user'
import { setDataUser } from '@/store/slices/userSlice';


export default function ProtectRoutes() {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const CheckTokenInLocalStorage = async () => {
        const token = AuthLocalStorage.getToken()
        if (!token) {
            navigate('/auth')
            return false
        }
        return true
    }


    const InitAuth = async () => {
    
        try {
            if (!await CheckTokenInLocalStorage()) return
            const res = await UserServices.getOwnInfo()
            dispatch(setDataUser({
                dataUser: res.data
            }))
        } catch (err: any) {
            AuthLocalStorage.removeToken()
            UserLocalStorage.removeEmail()
            navigate('/auth')
            timerSwal({
                icon: 'error',
                title: err?.response?.data?.error?.message || 'เกิดข้อผิดพลาด', 
                timer: 1500,
            })
        }
        
    }


    useEffect(() => {

        InitAuth

    }, [])


    return (<></>)

}