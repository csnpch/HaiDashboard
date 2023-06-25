import { elementPropsInterface } from "@/interfaces/share/elementProps";
import { _class } from "@/utils/helpers/functions";


interface propsInterface {
    className?: string
}


export default function ContentContainer(props: elementPropsInterface&propsInterface) {

    return (
        <>
        
            <div className={_class(`
                w-full bg-[#FFFFFF] p-6 rounded-xl shadow-sm overflow-y-auto
                ${props.className}
            `)}>
                { props.children }
            </div>
        
        </>
    )

}