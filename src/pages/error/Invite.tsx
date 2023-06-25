// build-in
import { useEffect } from 'react';
import { useState } from 'react';
// external
import { useNavigate, useParams } from 'react-router-dom';
// Internal
import CardScreenContainer from '@/components/container/CardScreenContainer';
import BannerInviteExpired from '@/assets/img/banner_receive_invite.svg'
import BannerInviteNotFound from '@/assets/img/banner_invite_not_found.svg'


interface stateErrorKeyValue {
    image: string
    title: JSX.Element
    subTitle: JSX.Element
    specialText: JSX.Element
}
interface stateErrorData {
    not_found: stateErrorKeyValue
    expired: stateErrorKeyValue
}

// state = 'not_found'|'expired'
export default function ErrorInvitePage() {

    const { stateError } = useParams()
    const navigate = useNavigate()
    // states
    const [dataShow, setDataShow] = useState<stateErrorKeyValue>()

    
    useEffect(() => {
        if (stateError === 'expired') {
            setDataShow(stateErrorData.expired)
        } else if (stateError === 'not_found') {
            setDataShow(stateErrorData.not_found)
        } else {
            alert('Invalid state error')
            navigate('/auth')
        } 
    }, [])


    const stateErrorData: stateErrorData = {
        not_found: {
            image: BannerInviteExpired,
            title: <>- ลิ้งเชิญหมดอายุ -</>,
            subTitle: <>โปรดติดต่อผู้ให้ลิ้งเชิญของคุณอีกครั้ง เพื่อรับลิ้งเชิญใหม่</>,
            specialText: <span>
                ( 
                    ลิ้งเชิญมีอายุ 
                    <span className='text-[#DF0000]'>15 นาที</span> 
                    ควรลงทะเบียนภายในเวลาที่กำหนดหลังจากได้รับลิ้ง 
                )
            </span>
        },
        expired: {
            image: BannerInviteNotFound,
            title: <>- ไม่พบลิ้งเชิญ -</>,
            subTitle: <>โปรดตรวจสอบว่าให้แน่ใจว่าลิ้งเชิญที่ได้มานั้นถูกต้องหรือไม่ ?</>,
            specialText: <span>( หากพบว่าถูกต้องแล้วแต่ยังไม่พบ โปรดติดต่อผู้เชิญเพื่อทำการขอลิ้งเชิญใหม่อีกครั้ง )</span>
        }
    }


    return (
        <>
            <CardScreenContainer
                className={`
                    grid grid-rows-[2fr_1fr] p-2 overflow-y-auto gap-y-10
                `}
            >
                <div className={`
                    wh-full overflow-hidden flex justify-center items-end
                `}>

                    <div className={`w-full h-5/6 flex-center`}>
                        <img 
                            src={dataShow?.image || ''} alt='#' 
                            className={`
                                w-full object-contain h-full
                            `}
                        />
                    </div>

                </div>
                <div className={`wh-full`}>
                   
                    <div className={`
                        lg:pt-4 wh-full flex flex-col justify-start items-center
                        gap-y-6 tracking-wider px-10
                    `}>
                        <p className={`text-xl lg:text-3xl text-[#DF0000]`}>
                            {dataShow?.title}
                        </p>
                        <div className={`flex flex-col items-center gap-y-2`}>
                            <p className={`text-lg lg:text-xl text-[#234AA0]`}>
                                {dataShow?.subTitle}
                            </p>
                            <p className={`lg:text-lg text-[#222222]`}>
                                {dataShow?.specialText}
                            </p>
                        </div>
                    </div>
                
                </div>
            </CardScreenContainer>
        </>
    )
}