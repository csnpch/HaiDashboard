import logo from '@/assets/icon/organization.png'
import { _class } from '@/utils/helpers/functions'


interface propsInterface {
    className?: string
    classes?: {
        flexGap?: string
        img?: string
        text?: string
    }
}


export default function FullLogoVertical(props: propsInterface) {

    return (
        <>
        
            <div 
                className={_class(`
                    w-full flex justify-center select-none
                    ${props.className}
                `)}
            >

                <div className={`flex flex-col items-center gap-y-4 ${props.classes?.flexGap}`}>
                    
                    <img src={logo} alt="#" 
                        className={_class(`
                            w-full object-contain 
                            ${props.classes?.img ? props.classes?.img : 'max-h-24'}
                        `)}
                    />  

                    <p className={_class(`font-medium text-lg tracking-wider text-[#ED1B24] ${props.classes?.text}`)}>
                        Healthcare Quality Report
                    </p>              

                </div>

            </div>
        
        </>
    )

}