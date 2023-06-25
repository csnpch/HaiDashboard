import { useContext, useEffect, useState } from "react"
import { FilterContext } from "@/data/context/filter"
import { regional_health } from "@/data/dict/regional_health"
import { HiLocationMarker } from "react-icons/hi"
import { IoClose } from "react-icons/io5"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import { MapContext } from "@/data/context/map"
import { getDataMap } from "@/store/slices/mapSlice"
import { regionalHealthFilter } from '@/data/json/filter_data.json'
import { IOccupiesDrillDown } from "@/interfaces/api/hospital"
import { Tooltip } from "@mantine/core"
import { Badge } from "@mantine/core"
import { XverServices } from "@/services/api/hospital/dashboard"
import { _class, getAnyValueShowToColumn, isBrightColor } from "@/utils/helpers/functions"
import { colors } from "@/config/color"



interface propsInterface {
    mediaQuery: {
        isBigScreen: boolean,
        isVeryBigScreen: boolean
    },
    handleCloseProvinceClickedData: () => void,
    handleClickHospital: (h_code: string) => void,
}


export default function Occupies(props: propsInterface) {
    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const dataMap = useSelector((state: RootState) => getDataMap(state))
    const [hospitals, setHospitals] = useState<IOccupiesDrillDown[]>([])
    
    const [loading, setLoading] = useState({
        loading: true,
        errState: false,
    })


    const fetchData = async () => {
        try {
            const res = await XverServices.HospitalsWithOccupies(
                filter_context.year.value,
                filter_context.regional_health.id,
                filter_context.map.provinceSelected.state
            )
            setLoading(prevState => ({
                ...prevState,
                loading: false,
                errState: false
            }))
            if (!res.data) return
            
            const sortedOccupies = res.data.sort((a: IOccupiesDrillDown, b: IOccupiesDrillDown) => {
                if (!a.occupy_bed_rate.Valid || !b.occupy_bed_rate.Valid) return 0
                return b.occupy_bed_rate.Float64 - a.occupy_bed_rate.Float64
            })
            setHospitals(sortedOccupies)
        } catch (err: any) {
            console.log(err)
            setLoading(prevState => ({
                ...prevState,
                loading: false,
                errState: true
            }))
        }
    }



    useEffect(() => {
        setLoading(prevState => ({
            ...prevState,
            loading: true,
            errState: false
        }))
        setHospitals([])
        fetchData()
    }, [
        dataMap,
        filter_context.year.value,
        filter_context.regional_health.id,
        filter_context.map.provinceSelected.state
    ])


    return (
        <>
        
            <div className={`flex justify-between items-center pt-4 pb-2`}>
                <div className={`flex items-center gap-x-1`}>
                    <HiLocationMarker className='text-rose-600' />
                    {
                        filter_context.regional_health.id !== regional_health.thirteen.id &&
                        <span className={`text-rose-600`}>
                            {map_context.hover.isHover ? 'จังหวัด ' : ''}{`${map_context.hover.valueIs}`}
                        </span>
                    }
                    {
                        filter_context.regional_health.id !== regional_health.all.id &&
                        <span className="ml-1 text-black/60"> 
                            {`( ${regionalHealthFilter.find(item => item.id === filter_context.regional_health.id)?.label || ''} )`}
                        </span>
                    }
                </div>
                {
                    <div 
                        onClick={props.handleCloseProvinceClickedData}
                    >
                        <IoClose
                            className={`text-lg cursor-pointer`} 
                        />
                    </div>
                }
            </div>

            {
                loading.errState &&
                <p className={`text-center mt-4 text-red-600`}>- เกิดข้อผิดพลาด -</p>
            }

            {
                loading.loading &&
                <p className={`text-center pt-6 text-black/60 pb-4`}>Loading...</p>
            }

            {
                !loading.loading &&
                <div className={`w-full flex flex-col`}>

                    {
                        hospitals.length > 0 &&
                        <div className={_class(`
                            w-full grid grid-cols-[28px,2fr,1fr,1fr,1fr,1fr,1fr]
                            py-2 font-semibold tracking-wide text-sm items-end
                        `)}>
                            <p>#</p>
                            <p>โรงพยาบาล</p>
                            <p className={`text-center`}>
                                การรับรอง
                            </p>
                            {/* // ha_level, cmi, bed, occupy_bed_rate */}
                            <p className={`text-center`}>
                                ระดับ รพ.
                            </p>
                            <p className={`text-center pr-4`}>
                                Bed Occupies
                            </p>
                            <p className={`text-center pr-4`}>
                                Incident
                            </p>
                            <p className={`text-center pr-4`}>
                                Doctor Ratio
                            </p>
                        </div>
                    }
                    <div 
                        className={`w-full flex flex-col overflow-y-auto custom_scrollbar_show`}
                        style={{
                            height: props.mediaQuery.isBigScreen 
                                ? 'calc(100vh - 39rem)' 
                                : props.mediaQuery.isVeryBigScreen 
                                ? 'calc(100vh - 30rem)' 
                                : 'calc(100vh - 26rem)',
                            paddingBottom: props.mediaQuery.isBigScreen ? '2rem' : 'calc(100vh - 38rem)',
                        }}
                    >   

                        {
                            hospitals &&
                            hospitals.map((item, index) => {
                                return (
                                    <div 
                                        key={index}
                                        className={_class(`
                                            w-full grid grid-cols-[28px,2fr,1fr,1fr,1fr,1fr,1fr]
                                            p-2 rounded-sm cursor-pointer hover:bg-gray-200 text-sm duration-200
                                            ${index % 2 === 0 ? 'bg-gray-100' : ''}
                                        `)}
                                        // @ts-ignore
                                        onClick={() => props.handleClickHospital(item.hospital_code)}
                                    >
                                        <p className={`text-center`}>
                                            {index + 1}.
                                        </p>
                                        <Tooltip
                                            label={item.hospital_name}
                                            position='bottom-start'
                                            withArrow
                                            arrowSize={8}
                                            color="black"
                                        >
                                            <p className={`truncate`}>
                                                { item.hospital_name } 
                                            </p>
                                        </Tooltip>
                                        <p className={`
                                            text-center
                                            ${item.accreditation_status ? '' : 'opacity-40'}
                                        `}>
                                            { item.accreditation_status || 'ไม่มีข้อมูล' }
                                        </p>
                                        <p className={`text-center`}>
                                            { item.organization_level }
                                        </p>
                                        <div className={`flex flex-center`}>
                                            <Badge
                                                variant="filled"
                                                style={{
                                                    backgroundColor: item.occupy_bed_rate.Valid ? item.color : colors.N_A,
                                                    color: isBrightColor(item.color) ? 'black' : 'white',
                                                }}
                                            >
                                                { 
                                                    getAnyValueShowToColumn(
                                                        item.occupy_bed_rate.Valid
                                                        ? item.occupy_bed_rate.Float64
                                                        : 'N/A'
                                                    ) 
                                                }
                                            </Badge>
                                        </div>
                                        <p className={`text-center`}>
                                            { 
                                                getAnyValueShowToColumn(
                                                    item.e_up_percent.Valid 
                                                    ? item.e_up_percent.Float64
                                                    : '-'
                                                ) 
                                            }
                                        </p>
                                        <p className={`text-center`}>
                                            {/* @ts-ignore */}
                                            { item.ratio_per_person.toLocaleString() }
                                        </p>
                                    </div>
                                )
                            })
                        }

                        {
                            hospitals.length === 0 &&
                            <p className={`text-gray-500 text-center mt-6 text-sm`}>- ไม่พบข้อมูล -</p>
                        }
                        
                    </div>
                
                </div>
            }
    
        
        </>
    )

}