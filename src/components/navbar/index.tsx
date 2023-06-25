// built-in
import { useState, useContext } from 'react'
// external
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import { TbFilter } from 'react-icons/tb'
import { MdMoreVert, MdManageAccounts } from 'react-icons/md'
import { HiOutlineLogout, HiOutlineKey, HiOutlineMap } from 'react-icons/hi'
// internal
import { routes } from '@/router'
import { typeDropDownState } from '@/interfaces/type/navbar'
import { NavbarDropdownContext } from '@/data/context/navbar'
import BaseDropdown, { dataDropDownNavInterface } from './DropDownNav'
import { RootState } from '@/store'
import { 
    getCurrentIndexFilterRegional, 
    getCurrentIndexFilterRegionalHealth, 
    getCurrentIndexIndicator, 
    setCurrentIndexFilterRegional, 
    setCurrentIndexFilterRegionalHealth, 
    setCurrentIndexIndicator 
} from '@/store/slices/navbarSlice'
import { UserLocalStorage } from '@/services/localStorage/user'
import { AuthLocalStorage } from '@/services/localStorage/auth'
import { timerSwal } from '@/utils/sweetAlert'
import { getDataUser } from '@/store/slices/userSlice'
import { regionalFilter, regionalHealthFilter } from '@/data/json/filter_data.json'
import { FilterContext } from '@/data/context/filter'
import { regionCode } from '@/interfaces/type/map'
import { ListLabelIndicator } from '@/data/indicator'
import { _class, subString } from '@/utils/helpers/functions'
import logoHealthcare from '@/assets/icon/organization.png'
import { useMediaQuery } from 'react-responsive'
import { MapContext } from '@/data/context/map'
import { BiSearchAlt } from 'react-icons/bi'
import ModalSearchHospital from './ModalSearchHospital'
import { Tooltip } from 'antd'


interface propsInterface {  
    className?: string
}


export default function Navbar(props: propsInterface) {

    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })

    const navigate = useNavigate()
    const [stateDropdown, setStateDropdown] = useState<typeDropDownState>('none')
    const [isModalOpenSearch, setIsModalOpenSearch] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    // const [notFoundSearch, setNotFoundSearch] = useState(false);
    const [dropDownYear, _setDropDownYear] = useState<dataDropDownNavInterface[]>(Array.from(Array(6).keys()).map((_, index) => {
        return {
            index: index,
            label: `${2023 - index}`,
            action: () => {
                filter_context.year.setValue(2023 - index)
            }
        }
    }))
    // store
    const dispatch = useDispatch()
    const currentIndexFilterRegional = useSelector((state: RootState) => getCurrentIndexFilterRegional(state))
    const currentIndexFilterRegionalHealth = useSelector((state: RootState) => getCurrentIndexFilterRegionalHealth(state))
    const currentIndexIndicator = useSelector((state: RootState) => getCurrentIndexIndicator(state))
    const dataUser = useSelector((state: RootState) => getDataUser(state))


    const onSearch = (value: string) => {
        filter_context.map.hospitalCode.setState(value)
        filter_context.onSearchHospital.setValue(true)
        setLoadingSearch(true)
        setTimeout(() => {
            setIsModalOpenSearch(false)
            setLoadingSearch(false)
        }, 500)
    }


    // useEffect(() => {
    //     if (notFoundSearch === false) {

    //     }
    // }, [notFoundSearch])


    // const dropDownMenu: dataDropDownNavInterface[] = [
    //     {
    //         index: 0,
    //         icon: <IoEarthSharp />,
    //         label: 'Dashboard',
    //         action: () => {
    //             navigate(routes.dashbaord_main.path)
    //         }
    //     },
    //     { 
    //         index: 1,
    //         icon: <FaHospital />,
    //         label: 'Hospital',
    //         action: () => {
    //             navigate(routes.dashboard_hospital.path)
    //         } 
    //     },
    // ]


    // ภูมิภาค
    const dropDownFilterRegional: dataDropDownNavInterface[] = regionalFilter
        .map((item, index) => {
            return {
                index: index,
                label: item.label,
                action: () => {
                    dispatch(setCurrentIndexFilterRegional({ index: index }))
                    filter_context.regional.setCode(item.code as regionCode)
                }
            }
        })

    // เขตสุขภาพ
    const dropDownFilterRegionalHealth: dataDropDownNavInterface[] = regionalHealthFilter
        .map((item, index) => {
            return {
                index: index,
                label: `${item.label}`,
                action: () => {
                    dispatch(setCurrentIndexFilterRegionalHealth({ index: index }))
                    filter_context.regional_health.setId(item.id)
                    filter_context.regional_health.setLabel(item.label)
                    filter_context.map.provinceSelected.setState('')
                    map_context.contentSideDataProvince.setIsOpen(false)
                }
            }
        })

    // ตัวชี้วัด
    const dropDownIndicators: dataDropDownNavInterface[] = ListLabelIndicator.map((item, index) => {
        return {
            index: index,
            label: item,
            action: () => {
                dispatch(setCurrentIndexIndicator({ index: index }))
                filter_context.indicator.setValue(item)
            }
        }
    })

    // โปรไฟล์
    const dropDownProfile: dataDropDownNavInterface[] = [
        {
            index: 0,
            icon: <HiOutlineKey />,
            label: 'เปลี่ยนรหัสผ่าน',
            action: () => {
                console.log('test1')
            }
        },
        {
            index: 1,
            icon: <HiOutlineLogout />,
            label: 'ออกจากระบบ',
            action: () => {
                UserLocalStorage.removeEmail()
                AuthLocalStorage.removeToken()
                setTimeout(() => navigate(routes.auth.path), 1800)
                timerSwal({
                    icon: 'success',
                    title: 'ออกจากระบบสำเร็จ',
                    timer: 1500
                })
            }
        },
    ]

    // อื่นๆ
    const dropDownMore: dataDropDownNavInterface[] = [
        {
            index: 0,
            icon: <MdManageAccounts />,
            label: 'จัดการผู้ใช้งาน',
            action: () => {
                setStateDropdown('none')
                navigate(routes.user_manage.path)
            },
            classes: { icon: 'text-xl' },
        },
    ]

    

    const handleSetStateDropdown = (slug: typeDropDownState) => {
        setStateDropdown(slug)
    }


    return (
        <>

            <ModalSearchHospital 
                stateModal={{
                    isModalOpen: isModalOpenSearch,
                    setIsModalOpen: setIsModalOpenSearch,
                }}
                onSearch={onSearch}
                onLoadingSearch={loadingSearch}
                notFound={false}
            />
            
            <NavbarDropdownContext.Provider value={{ state: stateDropdown, setState: setStateDropdown }}>

                <div className={_class(`container_navbar justify-between gap-x-4 ${props.className} select-none`)}>
                    
                    <div 
                        className={`h-full flex flex-row gap-x-2 2xl:gap-x-3 cursor-pointer`}
                        onClick={() => {
                            navigate(0)
                        }}
                    >

                        <div className={`h-full flex-center pl-2`}>
                            <img
                                src={logoHealthcare}
                                alt="#" 
                                className={`h-5/6 mr-0.5`}
                            />
                        </div>

                        <div className={_class(`
                            flex-center mr-4 font_logo text-sm lg:text-lg 2xl:text-xl 
                            font-medium tracking-wide
                        `)}>
                            HAI-Dashbaord
                        </div>

                    </div>
                
                    <div className={`h-full flex flex-row gap-x-2 2xl:gap-x-3`}>

                        {/* <BaseDropdown
                            id={`menu`}
                            icon={<IoEarthSharp />}
                            text={`Dashboard`}
                            onClick={() => handleSetStateDropdown('menu')}
                            data={[]}
                            classes={{
                                container: 'px-1 text-blue-700',
                            }}
                            currentIndexItemSelect={currentIndexSidebarMenu}
                            iconDropdown
                            // isMainMenu
                            uppercase
                            style={{
                                width: '240px'
                            }}
                            disableArrow
                            disableHover
                        /> */}

                        {/* ภูมิภาค */}
                        {
                            filter_context.filterUsing === 'regional' &&
                            <BaseDropdown
                                id={`filter_regional_th`}
                                icon={<HiOutlineMap />}
                                text={`${dropDownFilterRegional[currentIndexFilterRegional].label}`}
                                onClick={() => handleSetStateDropdown('filter_regional_th')}
                                data={dropDownFilterRegional.filter(item => {
                                    return item.label !== dropDownFilterRegional[currentIndexFilterRegional].label
                                })}
                                classes={{
                                    container: 'px-1 text-blue-700',
                                }}
                                iconDropdown
                                style={{
                                    width: 260
                                }}
                                largeData={!isBigScreen}
                            />
                        }
                        
                        {/* เขตสุขภาพ */}
                        {
                            filter_context.filterUsing === 'regional_health' &&
                            <BaseDropdown
                                id={`filter_regional_health`}
                                icon={<HiOutlineMap />}
                                text={`${dropDownFilterRegionalHealth[currentIndexFilterRegionalHealth].label}`}
                                onClick={() => handleSetStateDropdown('filter_regional_health')}
                                data={dropDownFilterRegionalHealth.filter(item => item.label)}
                                classes={{
                                    container: 'px-1 text-blue-700',
                                    containerItem: '2xl:h-8'
                                }}
                                iconDropdown
                                style={{
                                    width: 260
                                    // width: filter_context.regional_health.id === regional_health.thirteen.id
                                    //     ? '260px' : '220px'
                                }}
                            />
                        }
                        
                        {/* ตัวชี้วัด */}
                        <BaseDropdown
                            id={`indicators`}
                            icon={<TbFilter />}
                            text={`${
                                subString(
                                    dropDownIndicators[currentIndexIndicator].label, 
                                    19, '...'
                                )
                            }`}
                            onClick={() => handleSetStateDropdown('indicators')}
                            data={dropDownIndicators.filter(item => item.label)}
                            classes={{
                                container: 'px-1 text-blue-700',
                            }}
                            style={{
                                width: 260
                            }}
                            iconDropdown
                        />

                        
                        {/* ปี */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                && (
                                    filter_context.indicator.value === 'Incident'
                                    || filter_context.indicator.value === 'Infection Rate'
                                    || filter_context.indicator.value === 'Bed Occupancy'
                                    || filter_context.indicator.value === 'Environment Safety Score'
                                    || filter_context.indicator.value === 'Death Rate'
                                )
                            ) &&
                            <BaseDropdown
                                id={`year`}
                                icon={<HiOutlineMap />}
                                text={`${filter_context.year.value}`}
                                onClick={() => handleSetStateDropdown('year')}
                                data={dropDownYear}
                                classes={{
                                    container: 'px-1 text-blue-700',
                                    containerItem: '2xl:h-8'
                                }}
                                iconDropdown
                                style={{
                                    width: 150
                                }}
                            />
                        }


                    </div>

                    <div className={`h-full flex flex-row gap-x-2`}>
                        
                        {/* ค้นหา */}
                        <div 
                            className={`flex items-center p-4 pr-2 hover:bg-white rounded-lg border-2 border-[#E1E1E1] cursor-pointer`}
                            onClick={() => setIsModalOpenSearch(true)}
                        >
                            <div    
                                className={`flex items-center gap-x-2 text-black/80`}
                            >
                                <BiSearchAlt className={`text-xl`} />
                                <p className={`tracking-wide`}>ค้นหา</p>
                                <div>
                                </div>
                            </div>
                        </div>

                        {/* โปรไฟล์ */}
                        <BaseDropdown
                            id={`profile`}
                            icon={<Tooltip
                                title={
                                    dataUser 
                                    ? `${dataUser?.first_name} ${dataUser?.last_name}` || '- ไม่พบข้อมูลผู้ใช้งาน -' 
                                    : 'ไม่พบข้อมูลผู้ใช้งาน'
                                }
                                placement='left'
                                color='blue'
                            >
                                <FaUserCircle />
                            </Tooltip>}
                            text={''}
                            onClick={() => handleSetStateDropdown('profile')}
                            data={dropDownProfile}
                            iconDropdown
                            classes={{
                                container: 'w-12',
                                text: 'text-sm'
                            }}
                            disableArrow
                            dropdownPosition={`right-0`}
                        />

                        {/* อื่น ๆ */}
                        <BaseDropdown
                            id={`more`}
                            icon={<MdMoreVert />}
                            onClick={() => handleSetStateDropdown('more')}
                            data={dropDownMore}
                            classes={{
                                container: 'w-10'
                            }}
                            dropdownPosition={'right-0'}
                        />
                    </div>

                </div>

                </NavbarDropdownContext.Provider>

        
        </>
    )
}