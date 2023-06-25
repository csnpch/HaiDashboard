import { _class } from "@/utils/helpers/functions"
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs"

interface propsInterface {
    state: 'up' | 'down'
    value: string
    per: 'day'|'week'|'month'|'year'
    classes?: {
        container?: string
        containerValue?: string
        icon?: string
        value?: string
        perText?: string
        slash?: string
    }
}


export default function GrowthPer(props: propsInterface) {

    return (
        <>

            <div className={_class(`
                flex-center flex-row gap-2
                text-2xl
                ${props.classes?.container || ''}
            `)}>
                
                {/* value & icon  */}
                <div className={_class(`
                    gap-x-1 h-full
                    flex flex-row
                    ${
                        props.state === 'up'
                        ? 'text-[#00C486]'
                        : 'text-red-500'
                    }    
                    ${props.classes?.containerValue || ''}
                `)}>
                    <div className={_class(`
                        pt-0.5 flex-center text-lg
                        ${props.classes?.icon || ''}
                    `)}>
                        {
                            props.state === 'up'
                            ? <BsCaretUpFill />
                            : <BsCaretDownFill />
                        }
                    </div>
                    <div className={_class(`
                        flex-center
                        ${props.classes?.value || ''}
                    `)}>
                        { props.value }
                    </div>
                </div>

                {/* per */}
                <div className={_class(`
                    text-black/50
                    font-light
                    ${props.classes?.slash || ''}
                `)}>{`/`}</div>

                <div className={_class(`
                    text-black/50
                    font-light
                    ${props.classes?.perText || ''}
                `)}>
                    { props.per }
                </div>

            </div>
        
        </>
    )

}