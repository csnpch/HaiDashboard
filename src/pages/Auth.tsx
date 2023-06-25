// build-in
import { useEffect } from 'react';
// external
import { Button } from '@mantine/core';
// Internal
import CardScreenContainer from '@/components/container/CardScreenContainer';
import BannerAuth from '@/assets/img/banner_auth_page.svg'
import FullLogoVertical from '@/components/FullLogoVertical';
import TextInput from '@/components/TextInput';
import { useState } from 'react';
import { IdentifyServices } from '@/services/api/hospital/identify';
import { timerSwal } from '@/utils/sweetAlert';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/router';
import { AuthLocalStorage } from '@/services/localStorage/auth';
import { UserLocalStorage } from '@/services/localStorage/user';
import { Helmet } from 'react-helmet';


interface dataFormAuth {
    email: string,
    password: string
}


export default function AuthPage() {
    

    const navigate = useNavigate()

    const [dataForm, setDataForm] = useState<dataFormAuth>({
        email: 'eine.schlacht@gmail.com',
        password: '!First@14131413'
    })


    useEffect(() => {
        const token = AuthLocalStorage.getToken()
        if (token) {
            timerSwal({
                icon: 'info',
                title: 'คุณได้เข้าสู่ระบบอยู่แล้ว',
                subTitle: 'หากต้องการเปลี่ยนบัญชีผู้ใช้งาน กรุณาออกจากระบบก่อน',
                timer: 3500
            })
            navigate(routes.dashbaord_main.path)
        }
    }, [])


    const onSignIn = async () => {

        try {
            const res = await IdentifyServices.Authenticate(
                dataForm.email,
                dataForm.password
            )
            AuthLocalStorage.saveToken(res.data.access_token)
            UserLocalStorage.saveEmail(res.data.email_address)
            setTimeout(() => navigate(routes.dashbaord_main.path), 1800)
            timerSwal({
                icon: 'success',
                title: res.message,
                timer: 1500
            })
        } catch (err: any) {
            timerSwal({
                icon: 'error',
                title: err?.response?.data?.error?.message || 'เกิดข้อผิดพลาด', 
                timer: 1500,
            })
        }
        
    }
    

    const handleChangeInput = (
        e: React.ChangeEvent<HTMLInputElement>, 
        key: keyof dataFormAuth
    ) => {
        setDataForm({
            ...dataForm,
            [key]: e.target.value
        })
    }


    return (
        <>

            <Helmet>
                <title>Auth | HAI</title>
            </Helmet>

            <CardScreenContainer
                className={`
                    grid lg:grid-cols-2 p-2
                `}
            >
                <div className={`hidden w-full lg:flex justify-end items-center`}>
                    
                    <img 
                        src={BannerAuth} alt='#'
                        className={`
                            w-11/12 2xl:w-10/12
                            object-contain select-none
                        `}
                    />

                </div>
                <div className={`w-full flex justify-center items-start flex-col gap-y-6`}>

                    <div className={`-mt-10 w-full`}>
                        <FullLogoVertical />

                        <form 
                            action='#' 
                            method='#' 
                            className={`
                                mt-10 w-9/12 lg:w-6/12 mx-auto flex flex-col gap-y-5
                            `}
                        >
                            
                            {/* Email */}
                            <div className={`w-full flex flex-col`}>
                                <label className={`select-none tracking-wide`}>
                                    อีเมลล์
                                </label>
                                <TextInput
                                    type={`email`}
                                    value={dataForm.email}
                                    placeholder={`name@organization.com`}
                                    className={`mt-1.5`}
                                    onChange={(e) => handleChangeInput(e, 'email')}
                                />
                            </div>

                            {/* Password */}
                            <div className={`w-full flex flex-col`}>
                                <label className={`select-none tracking-wide`}>
                                    รหัสผ่าน
                                </label>
                                <TextInput 
                                    type={`password`}
                                    value={dataForm.password}
                                    placeholder={`***************`}
                                    className={`mt-1.5`}
                                    onChange={(e) => handleChangeInput(e, 'password')}
                                />
                            </div>


                            <Button 
                                radius="md" 
                                className={`
                                    h-12 tracking-wider font-normal duration-200
                                    bg-[#2563EB] hover:bg-[#2159d2] text-base
                                `}
                                onClick={onSignIn}
                            >
                                เข้าสู่ระบบ
                            </Button>
                            
                            <span 
                                className={`
                                    text-right text-[#2563EB] hover:underline
                                    cursor-pointer font-normal text-sm select-none
                                `}
                                onClick={undefined}
                            >
                                ลืมรหัสผ่าน ?
                            </span>


                        </form>
                    </div>
                
                </div>
            </CardScreenContainer>
        </>
    )
}