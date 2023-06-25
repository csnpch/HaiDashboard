// buildin
import { elementPropsInterface } from '@/interfaces/share/elementProps';
import { BiNetworkChart } from 'react-icons/bi';
import LoadingHeart from './LoadingHeart';
import { LoadingOverlay } from '@mantine/core';
import Error from './Error';
import { Empty } from 'antd';
import { _class } from '@/utils/helpers/functions';


interface propsInterface {
    ref?: React.RefObject<HTMLDivElement>,
    title: string,
    subTitle?: string|React.ReactNode,
    className?: string,
    mockup?: boolean,
    classes?: {
        icon?: string,
        containerText?: string,
        title?: string,
        subTitle?: string,
        chartContainer?: string,
    },
    viewLarge?: boolean,
    topRight?: React.ReactNode,
    stateLoading?: boolean,
    stateError?: boolean,
    stateEmptyData?: boolean,
    errorMsg?: string,
    useRelativeRoot?: boolean,
    triggerFetch?: () => void,
}


export default function CardChart({
    children,
    title,
    subTitle,
    className = '',
    mockup,
    ...props
}: elementPropsInterface & propsInterface) {


    return (
        <>

            <div className='wh-full relative'>
                {
                    (props.stateEmptyData && !props.stateLoading && !props.stateError)
                    && <div className={`z-30 absolute top-0 left-0 wh-full flex-center flex-col`}>
                        <Empty 
                            className={`mt-6`}
                            description={
                                `ไม่มีข้อมูล`
                            }
                        />
                        {
                            props.triggerFetch &&
                            <p 
                                className={`underline text-blue-700 text-[0.7rem] cursor-pointer select-none`}
                                onClick={() => props.triggerFetch && props.triggerFetch()}
                            >
                                ลองโหลดใหม่
                            </p>
                        }
                    </div>
                }
                {
                    props.stateError 
                    && <Error 
                        msg={props.errorMsg || ''}
                    />
                }
                {
                    !props.stateError && props.stateLoading 
                    && <LoadingHeart 
                        stateLoading={props.stateLoading || false}
                    />
                }
                <LoadingOverlay 
                    visible={props.stateLoading || props.stateError || false} 
                    overlayBlur={2} 
                    zIndex={80} 
                    loaderProps={{ size: 0 }}
                />

                <div
                    ref={props.ref}
                    className={_class(`
                        bg-white rounded-md border-2 border-[#E4E4E4] wh-full grid grid-rows-[min-content,1fr]
                        ${ mockup || '' && 'opacity-40'}
                        ${ className || ''}
                    `)}
                >
                    <div className={`pt-6 px-6 w-full flex flex-row justify-between items-center`}>

                        <div className='w-full gap-x-2.5 flex flex-row items-center'>
                            {/* base color text = #FF2E00 */}
                            <div className={`-mt-2 text-[#2563EB] text-xl 2xl:text-2xl`}>
                                <BiNetworkChart />
                            </div>
                            {/* title, subtitle */}
                            <div className={_class(`
                                -mt-1.5
                                ${ props.classes?.containerText || '' }
                            `)}>
                                <p className={_class(`
                                    text-[0.86rem] 2xl:text-lg tracking-wide ${subTitle ? 'mt-0' : '-mt-2'}
                                    ${ props.classes?.title || '' }
                                `)}>
                                    {title}
                                </p>
                                <p className={_class(`
                                    text-xs 2xl:text-sm text-black/50 -mt-0.5 2xl:mt-0
                                    ${ props.classes?.subTitle || '' }
                                `)}>
                                    { subTitle }
                                </p>
                            </div>
                        </div>


                        { props.topRight && props.topRight }
                    </div>
                    <div className={_class(`
                        ${props.useRelativeRoot ? '' : 'relative'}
                        ${ props.classes?.chartContainer || '' }
                        ${props.stateEmptyData && 'hidden'}
                    `)}>
                        { children }
                    </div>
                </div>

            </div>
        
        </>
    )


}