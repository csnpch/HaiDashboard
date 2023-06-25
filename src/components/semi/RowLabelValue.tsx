import { _class } from "@/utils/helpers/functions";

interface propsInterface {
    label: string,
    value: string | number,
    className?: string,
    labelClassName?: string,
    valueClassName?: string,
}

export default function RowLabelValue({
    label,
    value,
    className = '',
    labelClassName = '',
    valueClassName = '',
}: propsInterface) {
    return (
        <>
            <div className={_class(`
                flex flex-row justify-between items-center
                ${className}
            `)}>
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