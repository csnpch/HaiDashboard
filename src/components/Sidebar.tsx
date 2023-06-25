// external
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@mantine/core'
import { IoEarthSharp } from 'react-icons/io5'
// internal
import logoHealthcare from '@/assets/icon/organization.png'
import { routes } from '@/router'
import { RootState } from '@/store'
import { getCurrentIndexMenu, setCurrentIndexMenu } from '@/store/slices/navbarSlice'
import { _class } from '@/utils/helpers/functions'


interface itemNavbarInterface {
    icon: React.ReactNode
    label: string,
    onClick?: (_?: any) => void
}
type listItemSidebar = itemNavbarInterface[]


interface propsInterface {
    currentIndexActive?: number
    logoSrc?: string
    className?: string
}


export const sidebarRoutes: listItemSidebar[] = [
    // Group 1
    [
        { 
            icon: <IoEarthSharp />, 
            label: 'Dashboard', 
            onClick: (navigate: any) => {
                navigate(routes.dashbaord_main.path)
            }
        },
    ],
    // Group 2...
]


export default function Sidebar(props: propsInterface) {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // store
    const currentIndexSidebar = useSelector((state: RootState) => getCurrentIndexMenu(state))

    const handleClickMenu = (index: number) => {
        dispatch(setCurrentIndexMenu({ index: index }))
    }


    return (
        <>

            <div className={_class(`
                h-full w-16 2xl:w-20 flex flex-col items-center justify-start select-none
                ${props.className}
            `)}>
                
                {/* Logo container */}
                <div
                    className={`w-full h-16 flex-center rounded-full`}
                >
                    <img
                        src={logoHealthcare} 
                        alt="#" 
                        className={`w-12 h-12`}
                    />
                </div>
                
                {/* Routes container */}
                <div className={`w-full pt-4 flex flex-col items-center gap-y-4 text-[#35576C]`}>

                    {
                        sidebarRoutes.map((listItem, index) => (
                            <div 
                                key={index}
                                className={`relative w-full flex-col flex-center gap-y-4`}
                            >

                                {/* Left bg line group item */}
                                {
                                    sidebarRoutes.length > 1 &&
                                    <div className={`absolute h-full top-0 left-0 w-[0.32rem] bg-[#35576C]`} />
                                }


                                {
                                    listItem.map((item, idx) => {

                                        const countIndex = index * listItem.length + idx;
                                        return (
                                            <Tooltip
                                                key={idx}
                                                label={item.label}
                                                position="right"
                                                withArrow
                                            >
                                                <div
                                                    onClick={() => {
                                                        handleClickMenu(countIndex)
                                                        item.onClick && item.onClick(navigate)
                                                    }}
                                                    className={_class(`
                                                        w-12 h-12 flex-center rounded-full text-2xl
                                                        cursor-pointer
                                                        ${
                                                            currentIndexSidebar === countIndex && 
                                                            'bg-white text-[#213948] shadow-md'
                                                        }
                                                    `)}
                                                >
                                                    { item.icon }
                                                </div>
                                            </Tooltip>
                                        )
                                    })
                                }
                            </div>
                        ))
                            
                    }

                </div>

            </div>

        </>
    )
    
}