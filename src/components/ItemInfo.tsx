import { elementPropsInterface } from "@/interfaces/share/elementProps";
import ColLabelValue from "./semi/ColLabelValue";
import { _class } from "@/utils/helpers/functions";

interface propsInterface {
    label: string,
    value: string,
    icon?: React.ReactElement<elementPropsInterface>,
    className?: string,
    iconClassName?: string,
    textClassName?: string,
    labelClassName?: string,
    valueClassName?: string,
    buttonBottom?: boolean,
    buttonBottomText?: string,
    buttonBottomClassName?: string, 
    onClickButtonBottom?: () => void,
    buttonRight?: boolean,
    buttonRightText?: string,
    buttonRightClassName?: string,
    onClickRightBottom?: () => void,
    color?: string
}


export default function ItemInfo(props: propsInterface) {
    return (
        <>
            <div className={`w-full flex-center flex-col`}>


                <div className={_class(`
                    ${props.className}
                    w-full relative min-h-min lg:px-8 transform duration-200 
                    shadow_content flex flex-row items-center gap-x-5 bg-white
                    ${
                        props.buttonBottom 
                        ? 'rounded-t-xl pt-6 px-6 pb-4' 
                        : 'rounded-xl p-6'
                    }
                `)}>
                    
                    <div
                        style={{
                            color: props.color
                        }}
                        className={_class(`
                            flex-center
                            ${props.iconClassName}
                        `)}
                    >
                        { props.icon }
                    </div>

                    <ColLabelValue
                        label={props.label}
                        value={props.value}
                        className={props.textClassName}
                        labelClassName={_class(`${props.labelClassName || 'text-[#222]'} text-lg`)}
                        valueClassName={_class(`${props.valueClassName || 'text-[#4F4F4F]'}`)}
                    />

                    {/* Right card button */}
                    {
                        props.buttonRight &&
                        <button 
                            onClick={props.onClickRightBottom}
                            className={_class(`
                                rounded-r-xl absolute right-0 top-0 duration-200
                                h-full border-none text-[0.9rem] tracking-wide
                                ${ props.buttonRightClassName || 'bg-[#666]' }
                            `)}
                        >
                            <div className='wh-full flex-center text-white'>
                                {props.buttonRightText}
                            </div>
                        </button>
                    }

                </div>


                
                {/* Bottom card button */}
                {       
                    props.buttonBottom &&
                    <button 
                        onClick={props.onClickButtonBottom}
                        className={_class(`
                            rounded-b-xl w-full left-0 bottom-0 duration-200
                            h-10 border-none text-[0.9rem] tracking-wide
                            ${ props.buttonBottomClassName || 'bg-[#666]' }
                        `)}
                    >
                        <div className='wh-full flex-center text-white'>
                            {props.buttonBottomText}
                        </div>
                    </button>
                }

            </div>

        
        </>
    );
}
