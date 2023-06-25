import { elementPropsInterface } from "@/interfaces/share/elementProps"
import { _class } from "@/utils/helpers/functions"

interface propsInterface {
    className?: string
}


export default function BannerFormContainer(
    props: elementPropsInterface&propsInterface
) {
    return (
        <>
            <div className={`w-full flex-center h-screen`}>

                <div className={_class(`
                    w-11/12 2xl:w-8/12 h-[90%] 2xl:h-5/6 
                    bg-white rounded-2xl
                    shadow-[0_6px_12px_rgba(0,0,0,0.12)]
                    ${props.className}
                `)}>
                    { props.children }
                </div>

            </div>
        </>
    )
}