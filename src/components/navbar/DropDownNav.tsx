// build-in
import { useContext, useEffect, useState } from 'react'
// external
import { BsFillCaretDownFill } from 'react-icons/bs'
import { NavbarDropdownContext } from '@/data/context/navbar'
import { typeDropDownState } from '@/interfaces/type/navbar'
import BreakLine from '../semi/BreakLine'
import { setCurrentIndexMenu } from '@/store/slices/navbarSlice'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { _class } from '@/utils/helpers/functions'



interface classesInterface {
    container?: string
    icon?: string
    text?: string
    itemSelect?: string
    containerItem?: string
}


export interface dataDropDownNavInterface {
    index: number
    icon?: React.ReactNode
    label: string
    action: () => void
    classes?: classesInterface
}


interface propsInterface {
    id: typeDropDownState
    icon?: React.ReactNode
    currentIndexItemSelect?: number
    isMainMenu?: boolean
    text?: string
    iconDropdown?: boolean
    classes?: classesInterface
    onClick?: () => void
    data: dataDropDownNavInterface[]
    uppercase?: boolean
    style?: React.CSSProperties
    largeData?: boolean
    dropdownPosition?: string
    disableArrow?: boolean
    disableHover?: boolean
}


export default function BaseDropdown(props: propsInterface) {
    
    const dispatch = useDispatch()
    const { state: stateDropdown, setState: setStateDropdown } = useContext(NavbarDropdownContext)
    const itemSelected = props.data[props.currentIndexItemSelect || 0]
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const [dataDropDown, setDataDropDown] = useState(props.data)

    
    const handleClick = () => {
        props.onClick && props.onClick()
    }


    const filterDataDropDown = () => {
        
        if (props.data.length >= 10 && !isBigScreen) {
            // Sort for 2 column like grid-flow-col
            const first = props.data.slice(0, props.data.length / 2)
            const second = props.data.slice(props.data.length / 2, props.data.length)
            const sortedData = first.map((item, index) => {
                return [item, second[index]]
            }).flat()
            setDataDropDown(sortedData);
        } else {
            setDataDropDown(props.data)
        }

    }


    useEffect(() => {
        filterDataDropDown()
    }, [])


    return (
        <>

            <div 
                className={_class(`
                    relative h-full border-2 border-[#E1E1E1] rounded-lg cursor-pointer duration-200
                    ${(stateDropdown === props.id && !props.disableHover) && 'bg-white'}
                    ${props.classes?.container}
                `)}
                style={props.style}
                onClick={() => {
                    if (stateDropdown === props.id) return
                    stateDropdown !== 'none' && setStateDropdown('none')
                }}
                onMouseLeave={() => setStateDropdown('none')}
                onMouseEnter={() => setStateDropdown(props.id)}
            >

                <div
                    className={_class(`
                        wh-full flex-center gap-x-2.5 2xl:gap-x-3
                        ${props.iconDropdown ? 'px-4' : 'px-2.5'}
                    `)} 
                    onClick={handleClick}
                >
                    {/* Icon */}
                    {
                        props.icon &&
                        <div className={_class(`
                            flex-center text-black/80 
                            ${props.classes?.icon || 'text-[1.6rem]'} 
                        `)}>
                            { 
                                props.currentIndexItemSelect 
                                ? itemSelected.icon 
                                : props.icon 
                            }
                        </div>
                    }
                    {/* Text */}
                    {
                        props.text &&
                        <p className={_class(`
                            capitalize font_kanit font-medium tracking-wide
                            select-none text-black/80
                            ${props.text.length > 28 ? 'w-[22.6rem]' : 'w-80'}
                            ${props.classes?.text || 'text-[0.96rem]'}
                            ${props.uppercase && 'uppercase'}
                        `)}>
                            {
                                props.currentIndexItemSelect
                                ? itemSelected.label
                                : props.text
                            }
                        </p>
                    }
                    {/* Icon dropdown */}
                    {
                        (props.iconDropdown && !props.disableArrow) &&
                        <div className={`absolute right-4 flex-center text-md text-black/80`}>
                            <BsFillCaretDownFill />
                        </div>
                    }
                </div>

                {/* Dropdown */}
                {
                    (stateDropdown === props.id && props.data.length !== 0) &&
                    <>

                        <div 
                            className={_class(`
                                absolute pb-20 top-8 right-0
                                ${(!props.text) ? 'w-80' : 'w-full'}
                            `)}
                            style={{
                                zIndex: 500
                            }}
                        />

                        <div
                            style={{
                                zIndex: 600
                            }} 
                            className={_class(`
                                z-[60] absolute top-10 2xl:top-12 h-min p-2 bg-white rounded-lg
                                shadow-xl border-2 border-[#E1E1E1] 
                                ${props.dropdownPosition}
                                ${(!props.text) ? 'w-80' : 'w-full'}
                                ${
                                    isBigScreen 
                                    && 'flex flex-col gap-y-1 right-0'
                                }
                                ${
                                    props.data.length >= 10 && !isBigScreen 
                                    && 'grid grid-cols-[200px,200px] w-[420px] left-0'
                                }
                            `)}
                        >

                            {
                                dataDropDown.map((item, index) => {

                                    if (props.currentIndexItemSelect === index) return null
                                    
                                    return (
                                        <div
                                            key={index}
                                        >
    
                                            {
                                                (props.data.length > 2 && index !== 0) &&
                                                <BreakLine className={`bg-gray-200 mb-1 hidden 2xl:block`} />
                                            }
                                        
                                            <div
                                                onClick={() => {
                                                    props.isMainMenu && dispatch(setCurrentIndexMenu({ index: index }))
                                                    setStateDropdown('none')
                                                    item.action()
                                                }}
                                                className={_class(`
                                                    py-2.5 2xl:py-3 px-4 2xl:px-6 gap-x-2.5 flex items-center 
                                                    hover:bg-gray-100 rounded-md group
                                                    ${item.classes?.container}
                                                    ${props.classes?.containerItem || ''}
                                                `)}
                                            >
                                                {
                                                    item.icon &&
                                                    <div className={_class(`
                                                        flex-center text-lg text-black/80 
                                                        group-hover:text-[#213948]
                                                        ${item.classes?.icon}
                                                    `)}>
                                                        { item.icon }
                                                    </div>
                                                }
                                                <p className={_class(`
                                                    w-80 font_kanit font-medium
                                                    tracking-wider select-none
                                                    text-black/80 text-sm
                                                    group-hover:text-[#213948]
                                                    ${item.classes?.text}
                                                    ${props.uppercase && 'uppercase'}
                                                `)}>
                                                    { item.label }
                                                </p>
                                            
                                            </div>
                                        
                                        </div>
                                    )

                                })
                            }
                            
                        </div>

                    </>
                }

            </div>

        
        </>
    )


}
