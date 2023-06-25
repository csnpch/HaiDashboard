// build-in
import { useState } from 'react';
// Internal
import CardScreenContainer from '@/components/container/CardScreenContainer';
import BannerRegisterInvite from '@/assets/img/banner_receive_invite.svg'
import FullLogoVertical from '@/components/FullLogoVertical';
import TextInput from '@/components/TextInput';
import { Button } from '@mantine/core';



export default function RegisterInvitePage() {

    const [dataForm, setDataForm] = useState({
        phone: '',
    })


    const handleChangeDataForm = (key: string, value: string) => {
        setDataForm({
            ...dataForm,
            [key]: value
        })
    }


    return (
        <>
            <CardScreenContainer
                className={`
                    grid lg:grid-cols-2 p-2 overflow-y-auto
                `}
            >
                <div className={`
                    hidden w-full lg:flex 
                    flex-col 2xl:flex-row 
                    justify-center 2xl:justify-end
                    gap-10 overflow-hidden
                    items-center
                `}>
                    
                    <FullLogoVertical 
                        className='block 2xl:hidden' 
                        classes={{
                            img: 'max-h-16',
                            text: 'text-base',
                            flexGap: 'gap-y-2'
                        }}
                    />

                    <img 
                        src={BannerRegisterInvite} alt='#' 
                        className={`
                            w-11/12 2xl:w-10/12
                            object-contain h-[60%] 2xl:h-full
                        `}
                    />

                </div>
                <div className={`w-full flex lg:justify-center items-start flex-col gap-y-6 py-10 2xl:py-20`}>

                    <div className={`-mt-10 w-full`}>

                        <FullLogoVertical className='hidden 2xl:block' />

                        <div className={`w-9/12 2xl:px-10 mx-auto`}>


                            <div className={`mt-6 flex flex-col gap-y-1 tracking-wide`}>
                                <p>ยินดีต้อนรับ 🙏, คุณได้รับคำเชิญให้เข้าใช้งานระบบ</p>
                                <p className={`font-light text-sm`}>โปรดกรอกข้อมูลสำหรับเข้าใช้งานระบบลงในฟอร์ม</p>
                            </div>

                            <form 
                                action='#' 
                                method='#' 
                                className={`
                                    mt-6 w-full flex flex-col gap-y-5
                                `}
                            >

                                {/* Fullname */}
                                <div className={`w-full grid grid-cols-2 gap-x-4`}>
                                    <div className={`w-full flex flex-col`}>
                                        <label className={`tracking-wide`}>
                                            ชื่อจริง
                                        </label>
                                        <TextInput
                                            className={`mt-1.5`}
                                            placeholder={`ประหยัด`}
                                        />
                                    </div>
                                    <div className={`w-full flex flex-col`}>
                                        <label className={`tracking-wide`}>
                                            นามสกุล
                                        </label>
                                        <TextInput
                                            className={`mt-1.5`}
                                            placeholder={`จันทร์อังคาร`}
                                        />
                                    </div>
                                </div>
                                
                                {/* Email */}
                                <div className={`w-full flex flex-col`}>
                                    <label className={`tracking-wide`}>
                                        อีเมลล์
                                    </label>
                                    <TextInput
                                        className={`mt-1.5`}
                                        placeholder={`name@organization.com`}
                                    />
                                </div>

                                {/* Phone */}
                                <div className={`w-full flex flex-col`}>
                                    <label className={`tracking-wide`}>
                                        เบอร์มือถือ
                                    </label>
                                    <TextInput
                                        value={dataForm.phone}
                                        className={`mt-1.5`}
                                        placeholder={`098XXXXXXX`}
                                        type='number'
                                        maxLength={10}
                                        onChange={(e) => {
                                            handleChangeDataForm('phone', e.target.value)
                                        }}
                                    />
                                </div>

                                {/* Password */}
                                <div className={`w-full flex flex-col`}>
                                    <label className={`tracking-wide`}>
                                        รหัสผ่าน
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
                                    ลงทะเบียน
                                </Button>
                                

                            </form>


                        </div>
                    </div>
                
                </div>
            </CardScreenContainer>
        </>
    )
}