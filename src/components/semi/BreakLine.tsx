import { _class } from "@/utils/helpers/functions"

export default function BreakLine({
    className = '',
    vertical = false
}: {
    className?: string,
    vertical?: boolean
}) {


    return (
        <>
        
            { 
                vertical 
                ?
                <div 
                    className={_class(`h-full w-[0.1rem] bg-[#cdcdcd] ${className}`)}
                /> 
                :
                <div 
                    className={_class(`w-full h-[0.1rem] bg-[#cdcdcd] ${className}`)}
                />
            }
        
        </>
    )


}