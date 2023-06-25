import { FilterContext } from "@/data/context/filter"
import { regional_health } from "@/data/dict/regional_health"
import { useContext } from "react"
import { useDispatch } from "react-redux"
import { MapContext } from "@/data/context/map"
import { setCurrentIndexFilterRegionalHealth } from "@/store/slices/navbarSlice"
import CMIs from "./DrillDownProvinceClicked/CMIs"
import Incedetns from "./DrillDownProvinceClicked/Incedents"
import Environments from "./DrillDownProvinceClicked/Environments"
import Infections from "./DrillDownProvinceClicked/Infections"
import Occupies from "./DrillDownProvinceClicked/Occupies"
import Accreditations from "./DrillDownProvinceClicked/Accreditations"
import Mortalities from "./DrillDownProvinceClicked/Mortalities"
import PEPS from "./DrillDownProvinceClicked/PEPS"
import { _class } from "@/utils/helpers/functions"


interface propsInterface {
    mediaQuery: {
        isBigScreen: boolean,
        isVeryBigScreen: boolean
    },
    stateModalHospital: {
            opened: boolean,
            close: () => void,
            open: () => void,
    }
}



export default function ProvinceClickedData(props: propsInterface) {

    // stores / contexts
    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const dispatch = useDispatch()

    // states
    const handleCloseProvinceClickedData = () => {
        if (filter_context.regional_health.id === regional_health.thirteen.id) {
            map_context.contentSideDataProvince.setIsOpen(false)
            filter_context.regional_health.setId(0);
            dispatch(setCurrentIndexFilterRegionalHealth({ index: 0 }))
            return
        }

        filter_context.map.provinceSelected.setState('');
        map_context.contentSideDataProvince.setIsOpen(false)
    }


    const handleClickItemHospital = (hcode: string) => {
        filter_context.map.hospitalCode.setState(hcode)
        props.stateModalHospital.open()
    }


    return (
        <>

            <div 
                className={_class(`
                    z-40 absolute bg-white w-[60%] border-2 px-4 pb-1 rounded-lg
                    right-4 2xl:right-10 top-3 2xl:top-14
                `)}
            >


                {
                    filter_context.indicator.value === 'CMI' &&
                    <CMIs
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }
                
                {
                    filter_context.indicator.value === 'Incident' &&
                    <Incedetns
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }
                
                {
                    filter_context.indicator.value === 'Environment Safety Score' &&
                    <Environments
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }

                {
                    filter_context.indicator.value === "Bed Occupancy" &&
                    <Occupies
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }
            
                {
                    filter_context.indicator.value === 'Infection Rate' &&
                    <Infections
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }

                {
                    filter_context.indicator.value === 'Accreditation' &&
                    <Accreditations
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }

                {
                    filter_context.indicator.value === 'Death Rate' &&
                    <Mortalities
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }

                {
                    filter_context.indicator.value === 'PE / PS' &&
                    <PEPS
                        mediaQuery={props.mediaQuery}
                        handleCloseProvinceClickedData={handleCloseProvinceClickedData}
                        handleClickHospital={handleClickItemHospital}
                    />
                }
            
            </div>

        </>
    )
}