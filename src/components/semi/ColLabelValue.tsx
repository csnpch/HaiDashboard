import { _class } from "@/utils/helpers/functions"

interface propsInterface {
    label: string,
    value?: string,
    className?: string,
    labelClassName?: string,
    valueClassName?: string
}


export default function ColLabelValue({
    label,
    value = '',
    className = '',
    labelClassName = '',
    valueClassName = ''
}: propsInterface) {

    return (
        <>
        
            <div className={_class(`flex flex-col gap-y-0.5 ${className}`)}>
                <p className={_class(`${labelClassName}`)}>
                    { label }
                </p>
                <p className={_class(`${valueClassName}`)}>
                    { value }
                </p>
            </div>
        
        </>
    )
    
}