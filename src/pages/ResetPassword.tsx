// Internal
import CardScreenContainer from '@/components/container/CardScreenContainer';
import BannerResetPassword from '@/assets/img/banner_reset_passwd.svg'
import FullLogoVertical from '@/components/FullLogoVertical';
import TextInput from '@/components/TextInput';
import { Button } from '@mantine/core';



export default function ResetPasswordPage() {
    return (
        <>
            <CardScreenContainer
                className={`
                    grid lg:grid-cols-2 p-2
                `}
            >
                <div className={`hidden w-full lg:flex justify-end items-center`}>
                    
                    <img 
                        src={BannerResetPassword} alt='#' 
                        className={`
                            w-11/12 2xl:w-10/12
                            object-contain
                        `}
                    />

                </div>
                <div className={`w-full flex justify-center items-start flex-col gap-y-6`}>

                    <div className={`-mt-10 w-full`}>
                        
                        <FullLogoVertical />


                        <div className={`w-9/12 2xl:px-10 mx-auto`}>


                            <div className={`mt-8 w-full flex-center tracking-wide text-center`}>
                                <p>🔑 รีเซ็ตรหัสผ่าน : 
                                    <span className={`underline text-[#234AA0]`}>
                                        {`name@organization.com `}
                                    </span>
                                </p>
                            </div>

                            <form 
                                action='#' 
                                method='#' 
                                className={`
                                    mt-10 w-9/12 lg:w-8/12 mx-auto flex flex-col gap-y-5
                                `}
                            >
                                
                                {/* Email */}
                                <div className={`w-full flex flex-col`}>
                                    <label className={`tracking-wide`}>
                                        รหัสผ่านใหม่
                                    </label>
                                    <TextInput 
                                        className={`mt-1.5`}
                                        placeholder={`***************`}
                                        type={`password`}
                                    />
                                </div>

                                {/* Password */}
                                <div className={`w-full flex flex-col`}>
                                    <label className={`tracking-wide`}>
                                        รหัสผ่านใหม่อีกครั้ง
                                    </label>
                                    <TextInput 
                                        className={`mt-1.5`}
                                        placeholder={`***************`}
                                        type={`password`}
                                    />
                                </div>


                                <Button 
                                    radius="md" 
                                    className={`
                                        h-12 tracking-wider font-normal duration-200
                                        bg-[#2563EB] hover:bg-[#2159d2] text-base
                                    `}
                                    onClick={undefined}
                                >
                                    ตั้งรหัสผ่านใหม่
                                </Button>


                            </form>
                        </div>

                    </div>
                
                </div>
            </CardScreenContainer>
        </>
    )
}