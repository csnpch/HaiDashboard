import { useContext } from 'react'
import { useState, useEffect, useRef } from "react";
import Central from "./central";
import Eastern from "./eastern";
import Northeastern from "./northeastern";
import Northern from "./northern";
import Southern from "./southern";
import Western from "./western";
import { useMediaQuery } from "react-responsive";
import { regionCode } from "@/interfaces/type/map";
import { FilterContext } from '@/data/context/filter';
import { regional_th } from '@/data/dict/regional_th';
import Bangkok from './bangkok';
import { regional_health } from '@/data/dict/regional_health';
import ProvinceData from '@/data/json/mock_province.json';
import { MapContext } from '@/data/context/map';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentIndexFilterRegionalHealth, setCurrentIndexFilterRegionalHealth } from '@/store/slices/navbarSlice';
import { RootState } from '@/store';
import { _class } from '@/utils/helpers/functions';


export interface mapTH_potDataInterface {
    province_name: string
    value: number
    color: string
}


interface propsInterface {
    className?: string
    style?: React.CSSProperties
    svg?: {
        style?: React.CSSProperties,
    }
    data?: mapTH_potDataInterface[],
    zone?: regionCode
    statusReadyPaintColor?: boolean
}
const defaultProps: propsInterface = {
    zone: 0,
}


function MapTH(props: propsInterface) {


    // stores / context
    const currentIndexFilterRegionalHealth = useSelector((state: RootState) => getCurrentIndexFilterRegionalHealth(state))
    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const dispatch = useDispatch()
    // states
    const [loading, setLoading] = useState<boolean>(true)
    const [firstLoad, setFirstLoad] = useState<boolean>(true)
    const [loadingHiddenPath, setLoadingHiddenPath] = useState<boolean>(true)

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const refSvg = useRef<SVGSVGElement>(null)

    
    const findElementByProvinceName = (province_name: string) => {
        const element = document.querySelectorAll('.province')
        // find element by id
        for (let i = 0; i < element.length; i++) {
            const values = element[i].getAttribute('values')
            const splitProvince = values?.split(',')[1].split('=')[1].replaceAll('\r', '').replaceAll('\n', '').replaceAll(' ', '')

            if (province_name === splitProvince) {
                return element[i]
            }
        }
    }

    
    const potData = () => {
        props.data?.map((item: mapTH_potDataInterface) => {
            const element = findElementByProvinceName(item.province_name)
            if (!element) return
            element.addEventListener('mousemove', () => {
                handleHover(true, element)
            })
            element.addEventListener('mouseleave', () => {
                handleHover(false, element)
            })
            element.addEventListener('dblclick', () => {
                map_context.contentSideDataProvince.setIsOpen(true)
                const province = ProvinceData.find(p => p.name.includes(item.province_name));
                if (province) {
                    filter_context.regional_health.setId(province.region_health_key);
                    setTimeout(() => {
                        filter_context.map.provinceSelected.setState(item.province_name);
                    }, 100)
                    dispatch(setCurrentIndexFilterRegionalHealth({ index: province.region_health_key }))
                }
                handleHover(false, element)
            })
            element.setAttribute('fill', item.color)
            // const element = document.getElementById(item.key)
            // element?.setAttribute('fill', color[Math.floor(Math.random() * color.length)])
        })
    }

    
    function handleHover(status: boolean, element: Element | null) {
        try {
            const values = element?.getAttribute('values')
            const splitProvince = values?.split(',')[1].split('=')[1].replaceAll('\r', '').replaceAll('\n', '').replaceAll(' ', '')
            map_context.hover.setValue(splitProvince || element?.getAttribute('name') || 'N/A')
            map_context.hover.setHover(status)
            const boundingClientRect = element?.getBoundingClientRect()
            map_context.refContainerHover?.current?.setAttribute('style', `
                top: ${(boundingClientRect?.top || 0) + 24}px;
                left: ${(boundingClientRect?.right || 0) + 4}px;
            `)
        } catch { return }
    }


    const getDefaultZoneStyle = (): React.CSSProperties => {

        type tmpValType = { 
            scale: number, x: string, y: string, 
            width: string|number, height: string|number 
        }
        let tmpVal: tmpValType = { scale: 0, x: '', y: '', width: '100%', height: '100%' }
        
        
        if (filter_context.filterUsing === 'regional') {
            if (props.zone === regional_th.th.code) {
                tmpVal.scale = isBigScreen ? 0.26 : 0.16
                tmpVal.x = isBigScreen ? '34%' : '-12%'
                tmpVal.y = isBigScreen ? '-140%' : '-262%'
                tmpVal.width = 1000
                tmpVal.height = 1900
            } else if (props.zone === regional_th.bangkok.code) {
                tmpVal.scale = isBigScreen ? 0.4 : 0.17
                tmpVal.x = isBigScreen ? '0%' : '-32%'
                tmpVal.y = isBigScreen ? '-60%' : '-242%'
                tmpVal.width = 1300
                tmpVal.height = 1000
            } else if (props.zone === regional_th.northern.code) {
                tmpVal.scale = isBigScreen ? 1 : 0.65
                tmpVal.x = isBigScreen ? '38%' : '40%'
                tmpVal.y = isBigScreen ? '8%' : '-18%'
                tmpVal.height = 500
            } else if (props.zone === regional_th.central.code) {
                tmpVal.scale = isBigScreen ? 0.76 : 0.52
                tmpVal.x = isBigScreen ? '26%' : '30%'
                tmpVal.y = isBigScreen ? '-44%' : '-75%'
                tmpVal.height = 1000 
            } else if (props.zone === regional_th.eastern.code) {
                tmpVal.scale = isBigScreen ? 1.28 : 0.84
                tmpVal.x = isBigScreen ? '3%' : '-8%'
                tmpVal.y = isBigScreen ? '-49.5%' : '-70.5%'
                tmpVal.height = 1200
            } else if (props.zone === regional_th.western.code) {
                tmpVal.scale = isBigScreen ? 0.56 : 0.36
                tmpVal.x = isBigScreen ? '46%' : '60%'
                tmpVal.y = isBigScreen ? '-66%' : '-114%'
                tmpVal.height = 1200 
            } else if (props.zone === regional_th.southern.code) {
                tmpVal.scale = isBigScreen ? 0.70 : 0.48
                tmpVal.x = isBigScreen ? '34%' : '8%'
                tmpVal.y = isBigScreen ? '-81%' : '-115.5%'
                tmpVal.width = 1000
                tmpVal.height = 1900
            } else if (props.zone === regional_th.northeastern.code) {
                tmpVal.scale = isBigScreen ? 0.8 : 0.54
                tmpVal.x = isBigScreen ? '-8%' : '-26%'
                tmpVal.y = isBigScreen ? '-38%' : '-70.5%'
                tmpVal.width = 1000
                tmpVal.height = 800
            }
        } else if (filter_context.filterUsing === 'regional_health') {
            tmpVal.width = 1000
            tmpVal.height = 1900
            if (filter_context.regional_health.id === regional_health.all.id) {
                tmpVal.scale = isBigScreen ? 0.24 : 0.16
                tmpVal.x = isBigScreen ? '54%' : '-30%'
                tmpVal.y = isBigScreen ? '-158%' : '-262%'
            } else if (filter_context.regional_health.id === regional_health.one.id) {
                tmpVal.scale = isBigScreen ? 1 : 0.66
                tmpVal.x = isBigScreen ? '40%' : '14%'
                tmpVal.y = isBigScreen ? '1%' : '-25%'
            } else if (filter_context.regional_health.id === regional_health.two.id) {
                tmpVal.scale = isBigScreen ? 1.06 : 0.72
                tmpVal.x = isBigScreen ? '32%' : '8%'
                tmpVal.y = isBigScreen ? '-11%' : '-33.5%'
            } else if (filter_context.regional_health.id === regional_health.three.id) {
                tmpVal.scale = isBigScreen ? 1.5 : 0.94
                tmpVal.x = isBigScreen ? '28%' : '12%'
                tmpVal.y = isBigScreen ? '-6%' : '-26.5%'
            } else if (filter_context.regional_health.id === regional_health.four.id) {
                tmpVal.scale = isBigScreen ? 1.9 : 1.16
                tmpVal.x = isBigScreen ? '15%' : '2%'
                tmpVal.y = isBigScreen ? '-9%' : '-26%'
            } else if (filter_context.regional_health.id === regional_health.five.id) {
                tmpVal.scale = isBigScreen ? 0.84 : 0.46
                tmpVal.x = isBigScreen ? '40%' : '10%'
                tmpVal.y = isBigScreen ? '-41%' : '-90.5%'
            } else if (filter_context.regional_health.id === regional_health.six.id) {
                tmpVal.scale = isBigScreen ? 1.2 : 0.76
                tmpVal.x = isBigScreen ? '10%' : '-15%'
                tmpVal.y = isBigScreen ? '-31%' : '-55.5%'
            } else if (filter_context.regional_health.id === regional_health.seven.id) {
                tmpVal.scale = isBigScreen ? 1.5 : 0.96
                tmpVal.x = isBigScreen ? '-11%' : '-28.4%'
                tmpVal.y = isBigScreen ? '-3.5%' : '-23.5%'
            } else if (filter_context.regional_health.id === regional_health.edge.id) {
                tmpVal.scale = isBigScreen ? 1.14 : 0.76
                tmpVal.x = isBigScreen ? '-6.4%' : '-29%'
                tmpVal.y = isBigScreen ? '-3%' : '-27.5%'
            } else if (filter_context.regional_health.id === regional_health.nine.id) {
                tmpVal.scale = isBigScreen ? 1.14 : 0.74
                tmpVal.x = isBigScreen ? '-1.5%' : '-26%'
                tmpVal.y = isBigScreen ? '-17%' : '-41.5%'
            } else if (filter_context.regional_health.id === regional_health.ten.id) {
                tmpVal.scale = isBigScreen ? 1.3 : 0.76
                tmpVal.x = isBigScreen ? '-28%' : '-49%'
                tmpVal.y = isBigScreen ? '-12%' : '-39.5%'
            } else if (filter_context.regional_health.id === regional_health.eleven.id) {
                tmpVal.scale = isBigScreen ? 1 : 0.60
                tmpVal.x = isBigScreen ? '38%' : '12.5%'
                tmpVal.y = isBigScreen ? '-61%' : '-95.5%'
            } else if (filter_context.regional_health.id === regional_health.twelve.id) {
                tmpVal.scale = isBigScreen ? 1.36 : 0.8
                tmpVal.x = isBigScreen ? '21.5%' : '1%'
                tmpVal.y = isBigScreen ? '-66.6%' : '-93.5%'
            // 13 bangkok
            } else if (filter_context.regional_health.id === regional_health.thirteen.id) {
                tmpVal.scale = isBigScreen ? 4 : 3
                tmpVal.x = isBigScreen ? '14%' : '7.6%'
                tmpVal.y = isBigScreen ? '-4%' : '-9%'
            }
        }



        return {
            transform: `
                scale(${tmpVal.scale})
                translate(
                    ${tmpVal.x},
                    ${tmpVal.y}
                )
            `,
            width: tmpVal.width,
            height: tmpVal.height,
        }
    }


    const hiddenPath = () => {
        let statusShowAll = false

        if (filter_context.filterUsing === 'regional') return
        if (filter_context.regional_health.id === regional_health.not_in_any.id) {
            map_context.contentSideDataProvince.setIsOpen(true)
            return
        }
        if (filter_context.regional_health.id === regional_health.all.id) {
            statusShowAll = true
        }

        const element = document.querySelectorAll('.province')
        for (let i = 0; i < element.length; i++) {
            try {
                const values = element[i]?.getAttribute('values')
                if (!values) continue
                if (!statusShowAll) {
                    const splitRegionalHealth = values?.split(',')[2].split('=')[1].replaceAll('\r', '').replaceAll('\n', '').replaceAll(' ', '')
                    if (splitRegionalHealth === filter_context.regional_health.id.toString()) {
                        element[i].classList.toggle('hidden', false)
                        continue
                    }
                    element[i].classList.toggle('hidden', true)
                } else {
                    element[i].classList.toggle('hidden', false)    
                }
            } catch (err) { 
                console.log('err', err)
            }
        }
    }


    const processRegionHealth = () => {
        setTimeout(() => {
            hiddenPath()
        }, 200)
    }


    const resetColor = () => {
        const element = document.querySelectorAll('.province')
        for (let i = 0; i < element.length; i++) {
            element[i].setAttribute('fill', '#7c7c7c')
        }
    }


    useEffect(() => {
        // mockData()
        resetColor()
        setTimeout(() => {
            potData()
            setLoadingHiddenPath(false)
            setLoading(false)
            setFirstLoad(false)
        }, (firstLoad ? 1000 : 200))
    }, [props.zone, props.data, props.statusReadyPaintColor])

    
    useEffect(() => {
        
        if (filter_context.filterUsing === 'regional') return
        processRegionHealth()
        setLoading(false)
        setLoadingHiddenPath(true)
        map_context.contentSideDataProvince.setIsOpen(false)

    }, [filter_context.regional_health.id, currentIndexFilterRegionalHealth])
    


    return (
        <>

            <div 
                className={_class(`
                    absolute right-1/3 top-1/3
                    ${loading || loadingHiddenPath ? 'block' : 'hidden'}
                `)}
            >
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>

            <div
                className={_class(`
                    container_map_svg wh-full duration-300 relative
                    ${props.className || ''}
                    ${loading || loadingHiddenPath ? 'hidden' : 'block'}
                `)}
                style={props.style || {}}
            >

                {/* id in path is mean code of province */}

                <svg
                    ref={refSvg}
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="#7c7c7c"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    version="1.2"
                    style={
                        props.svg?.style || getDefaultZoneStyle()
                    }
                    className={`z-20`}
                >

                    <g id="th-map">
                        {/* กรุงเทพ ฯ */}
                        {
                            (
                                
                                filter_context.filterUsing === 'regional'
                                && (!props.zone || props.zone === regional_th.northern.code)
                            )
                            && <Bangkok />
                        }
                        {/* เหนือ */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.northern.code)
                            )
                            && <Northern />
                        }
                        {/* ตะวันออกเฉียงเหนือ */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.northeastern.code)
                            )
                            && <Northeastern />
                        }
                        {/* กลาง */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.central.code) 
                            )
                            && <Central />
                        }
                        {/* ตะวันตก */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.eastern.code) 
                            )
                            && <Eastern />
                        }
                        {/* ตะวันออก */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.western.code)
                            )
                            && <Western />
                        }
                        {/* ใต้ */}
                        {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.western.code)
                            )
                            && <Southern />
                        }
                        {/* เกาะเล็ก ๆ ต่าง ๆ */}
                        {/* {
                            (
                                filter_context.filterUsing === 'regional_health'
                                || (!props.zone || props.zone === regional_th.th.code)
                            ) 
                            && <path
                                id="THA99"
                                name=""
                                d="M236.4 1729.4l-1.5 0.3-1.2-0.8-1.5-6.1 0.7-0.9 1.2 0 2.9 0.8 0.2 0.7 0.7 0.5 0.4 0.6 0 1.8-0.2 1.4-0.9 1.4-0.8 0.3z m67.2-24.1l-1.9 0.4-1.2-0.6 0.4-2 1.4-1 0.7 1.2 0.6 2z m-30.2-45.3l-0.7 0.5-2.8-1-1.6-0.3-0.8-1.2-0.9-1.2-0.3-1 1-0.3 1.1 1 1.1 0.1 1.2 0.5 0.2 0.4 0.5 0.1 0.9 1 1.1 1.4z m-150.6-60.9l-0.6 0 0.2-2.4 0.6-0.6 0.3-0.3 0.8 0 0.5-0.2 0.2 1.1-1 1.4-1 1z m74-30.4l0.5 0.1 0.9-0.1 0.6 0.2 0.1 0.3-0.1 1.4-0.3 0.5-0.6 0.2-0.3 0.5 0 0.7 0.5 0.9 0.1 1.2-0.6 0.5-4.9-6.2-0.5-0.1-0.4-0.3-0.1-0.5 0.4-0.8 0.5-0.5 0.3 0 0.5-0.2 1.7 0.3 1.5 1.1 0.2 0.8z m-160.5-97.9l0.3 3.3-1.8-3-0.4-1.8 0.7-0.3 0.9-0.7 0.4 0.4-0.1 2.1z m76.5-65l-1.4 0.9-0.5-0.9 0.1-2.5 0.6-0.7 4.2-6.8 1 0 0.5 1.1-1.2 2.3-1.4 1.7-0.4 1 0.1 0.6 0.4 0.7-0.4 0.6-1.6 2z m21.8-83.4l0.6 0.2 0.8-0.1-1 2.4 0.5 1.4-0.1 1-0.4 0.8-0.6-0.3-0.5 3.4-0.8-1.2-0.9 0.2-0.7-0.8-0.3-1.5 0.1-1.1 0.2-0.5 0.3 0.1 0.6-0.5 0.2-1.5-0.7-1.4 0.6-0.8 0.4-0.1 0.4-1 1.3 1.3z m166.6-31.9l0 0.3 0.6 1-0.2 0.8 0.7 0.4-0.2 0.7 0.3 0.5 0 0.5-0.4 0.1-0.3 0.3-0.2 0.8-0.3 0.6-0.8 1.1-0.8 0.3-0.2 0.5-0.3-1.2-0.5 0.3-0.5-0.2-0.3-1.2 0.6-0.8 0.7-1.9-0.1-0.6-0.5-0.5-0.2-0.6 0.3-1.6 1.5 0.4 0.5-0.5 0.6 0.5z m320.5-209l-0.2 1.5-0.2 0.5-0.5-0.1-1.8 0.8 0.4 1.1-0.4 1.1-0.3-0.4-0.1-0.5-0.9-0.8-0.8-0.9-0.9-0.3-1.7 0.3-0.2 0.3-0.4-0.3 0-0.6 0.5-0.7 0.7 0.2 0.3-0.1 1.7-0.9-0.3-1.1 0.6-0.2 1.3 1 2.3 0.1 0.9 0z m-205.5-109.6l0.1 1.9 0.3 0.9-1.2 0.9-0.6 1.4-1.4 0.8-0.2-0.8-0.4-1.2-1.3-2.2 0.3-0.9 0.5 0.8 0.5-1.1 0.6-0.5 1 0 1.8 0z"
                            />
                        } */}
                    </g>

                    <circle id="0" cx="364.9" cy="858.3" />
                    <circle id="1" cx="445.9" cy="802.4" />
                    <circle id="2" cx="658" cy="722.2" />
                </svg>


            </div>
        
        </>
    );
}

MapTH.defaultProps = defaultProps;
export default MapTH;