/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FilterContext } from "@/data/context/filter"
import { regional_th } from "@/data/dict/regional_th"
import { useContext, useEffect, useState } from "react"
import provinceData from '@/data/json/mock_province.json' 
import { regional_health } from "@/data/dict/regional_health"
import { colorBase } from '@/data/json/color_map.json'
import RowLabelValue from "@/components/semi/RowLabelValue"
import BreakLine from "@/components/semi/BreakLine"
import { regionalHealthFilter } from '@/data/json/filter_data.json'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {getDataMap} from "@/store/slices/mapSlice.ts";
import { setCurrentIndexFilterRegionalHealth } from "@/store/slices/navbarSlice"
import { IoChevronBackOutline } from "react-icons/io5"
import { MapContext } from "@/data/context/map"
import { _class } from "@/utils/helpers/functions"



export function LeftSideData() {

    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const dataMap = useSelector((state: RootState) => getDataMap(state))
    const [avg, setAvg] = useState(0);
    const [hospitalTotal, setHospitalTotal] = useState(0);
    const dispatch = useDispatch()

    const [primaryData, setPrimaryData] = useState<{
        id: number,
        label: string,
        name: string,
        value: number,
    }>()
    const [data, setData] = useState<any[]>([])


    const handleOpenProvinceClickedData = (item: any) => {
        if (filter_context.regional_health.id === regional_health.all.id) {
            const findFilterItem = regionalHealthFilter.find(item2 => item2.id === item.id)
            filter_context.regional_health.setId(item.id)
            // filter_context.map.valueHover
            dispatch(setCurrentIndexFilterRegionalHealth({index: (findFilterItem?.index || 0) - 1 < 0 ? 0 : (findFilterItem?.index || 0) - 1}))
            return
        }
        filter_context.map.provinceSelected.setState(item.name)
        map_context.contentSideDataProvince.setIsOpen(true)
        map_context.hover.setValue(item.name)
    }
    

    const processData = () => {

        const tmpData = filter_context.filterUsing === 'regional'
            // จังหวัด (เลิกใช้แล้ว)
            ? (
                filter_context.regional.code === regional_th.th.code
                // ทั้งประเทศ
                ? provinceData
                // เฉพาะภาค
                : provinceData.filter( item => item.region_id === filter_context.regional.code )
            )
            // เขต (ใช้อยู่)
            : (
                filter_context.regional_health.id === regional_health.all.id
                // ทุกเขต
                ? regionalHealthFilter.filter(item => item.id !== regional_health.all.id)
                // เฉพาะเขต
                : provinceData.filter( item => item.region_health_key === filter_context.regional_health.id)
            )
        
        if (!tmpData) return
        const primaryData: any = filter_context.filterUsing === 'regional_health' 
            ? (
                Object.values(regional_health).find(
                    item => item.id === filter_context.regional_health.id
                ) || null
            ) 
            : (
                Object.values(regional_th).find(
                    item => item.code === filter_context.regional.code
                ) || null
            )

        if (!primaryData) {
            setPrimaryData(undefined)
            return
        }

        let sum_avg = 0;
        let total_hospital = 0;

        tmpData.map(item => {
            let avg = 0.0;
            // @ts-ignore
            if (item.label) {
                const data_zone = dataMap.filter(item2 => {
                    const zone_number = parseInt(item2.service_zone.slice(3));
                    return zone_number == item.id;
                })
                total_hospital += data_zone.length
                const sum = data_zone.reduce((result, item2) => result += item2.value, 0)
                avg = (sum / data_zone.length);
            } else {
                // @ts-ignore
                const data_province = dataMap.filter(item2 => item2.province_name.includes(item.name))
                const sum = data_province.reduce((result, item2) => result += item2.value, 0)
                avg = (sum / data_province.length);
                total_hospital += data_province.length
            }
            // @ts-ignore
            item.value = isNaN(avg) ? 0 : avg
            // @ts-ignore
            sum_avg += item.value
        });

        setPrimaryData({
            id: primaryData.id,
            label: primaryData.label,
            name: primaryData.name,
            value: sum_avg/tmpData.length
        })

        setAvg(sum_avg/tmpData.length);
        setHospitalTotal(total_hospital);
        let tmpDataSorted = tmpData
        if (filter_context.regional_health.id !== regional_health.all.id) {
            // @ts-ignore
            tmpDataSorted = tmpData.sort((a, b) => b.value - a.value)
        }
        setData(tmpDataSorted)

        if (filter_context.regional_health.id === regional_health.thirteen.id) {
            filter_context.map.provinceSelected.setState("กรุงเทพฯ")
            map_context.contentSideDataProvince.setIsOpen(true)
            dispatch(setCurrentIndexFilterRegionalHealth({ index: 13 }))
        }
    }


    const handleBackToAllRegionHealth = () => {
        filter_context.regional_health.setId(regional_health.all.id)
        filter_context.map.provinceSelected.setState('');
        dispatch(setCurrentIndexFilterRegionalHealth({index: 0}))
        map_context.contentSideDataProvince.setIsOpen(false)
    }


    const handleClickRegionalHealth = () => {
        if (!primaryData) return
        if (primaryData.id === regional_health.thirteen.id) {
            filter_context.regional_health.setId(regional_health.thirteen.id)
            filter_context.map.provinceSelected.setState('กรุงเทพฯ');
            dispatch(setCurrentIndexFilterRegionalHealth({ index: 13 }))
            return
        }
        map_context.contentSideDataProvince.setIsOpen(false)
        filter_context.regional_health.setId(primaryData.id)
        filter_context.map.provinceSelected.setState('');

    }


    useEffect(() => {
        if (!dataMap) return
        processData()
    }, [filter_context.regional_health.id, dataMap])


    return (
        <>


            <div className={_class(`
                z-30 absolute bottom-1 pb-6 left-8 px-4
                bg-white w-[30%] 2xl:w-[26%]
                flex flex-col gap-y-1.5 text-[0.8rem]
            `)}>
                <BreakLine className={`opacity-40`} />
                <RowLabelValue
                    label="โรงพยาบาลที่มีข้อมูล"
                    value={hospitalTotal}
                    className="text-gray-500"
                />
                {/* Not done */}
                {/* <RowLabelValue
                    label="โรงบาลที่ไม่มีข้อมูล"
                    value={0}
                    className="text-gray-500"
                /> */}
            </div>


            <div 
                className={_class(`
                    z-20 absolute top-[3.4rem] 2xl:top-[4.8rem] left-8 p-4 
                    rounded-md bg-white w-[34%] 2xl:w-[26%]
                `)}
            >


                <div className={`relative wh-full flex flex-col gap-y-4`}>

                    {
                        filter_context.regional_health.id !== regional_health.all.id &&
                        <div 
                            className="absolute -left-10 text-md p-2 cursor-pointer"
                            onClick={() => handleBackToAllRegionHealth()}
                        >
                            <IoChevronBackOutline />
                        </div>
                    }

                    {/* Master data : Regional */}
                    <div
                        className={`flex justify-between text-xs text-black/80 tracking-wide pr-2`}
                    >   
                        <p>ชื่อเขต</p>
                        <p>ค่าเฉลี่ย</p>
                    </div>
                    <div 
                        className={`pr-2 -mt-2 hover:underline cursor-pointer`}
                        onClick={() => handleClickRegionalHealth()}
                    >
                        <RowLabelValue
                            label={`${primaryData?.label} ${primaryData?.name}` || 'ไม่พบข้อมูลผลรวม'}
                            value={avg.toFixed(2) || primaryData?.value.toFixed(2) || 0}
                            className={`text-sm 2xl:text-base text-blue-800`}
                        />
                        <div className='relative bg-gray-100 w-full h-1'>
                            <div 
                                className={_class(`
                                    absolute left-0 top-0 h-1 rounded-sm
                                    transform duration-500
                                `)} 
                                style={{
                                    width: `${primaryData?.value}%`,
                                    // backgroundImage: `linear-gradient(to right, #6366f1, #a855f7, #ec4899)`,
                                    background: `
                                        linear-gradient(
                                            to right, 
                                            ${colorBase.level1}, 
                                            ${colorBase.level2}, 
                                            ${colorBase.level3}, 
                                            ${colorBase.level4}
                                        )
                                    `,
                                    clipPath: `inset(0 ${100 - (primaryData?.value || 0)}% 0 0)`
                                }}
                            />
                        </div>
                    </div>


                    <div 
                        className={`custom_scrollbar overflow-y-auto flex flex-col gap-y-4 pr-2 pb-40 2xl:pb-20 h-[18rem] 2xl:h-[24.6rem]`}
                    >
                        
                        {
                            filter_context.regional_health.id !== regional_health.thirteen.id  
                            && data.map((item, index) => {
                                return (
                                    <div
                                        key={index} 
                                        className={_class(`
                                            flex flex-col gap-y-0.5
                                            hover:text-black/60 hover:underline cursor-pointer
                                            transform duration-300
                                        `)}
                                        onClick={() => handleOpenProvinceClickedData(item)}
                                    >
                                        <RowLabelValue
                                            label={item.name || item.label || '-'}
                                            value={item.value.toFixed(2) || 0}
                                            className={`text-sm 2xl:text-base`}
                                        />
                                        <div className='relative bg-gray-100 w-full h-1'>
                                            <div 
                                                className={_class(`
                                                    absolute left-0 top-0 h-1 rounded-sm
                                                    transform duration-500
                                                `)} 
                                                style={{
                                                    width: '100%',
                                                    background: `
                                                        linear-gradient(
                                                            to right, 
                                                            ${colorBase.level1}, 
                                                            ${colorBase.level2}, 
                                                            ${colorBase.level3}, 
                                                            ${colorBase.level4}
                                                        )
                                                    `,
                                                    clipPath: `inset(0 ${100 - item.value}% 0 0)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

            </div>
        
        
        </>
    )
}
