// build-in
import { useContext, useEffect, useRef, useState } from "react";
// external
import { useMediaQuery } from "react-responsive";
import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
// internal
import CardChart from "@/components/CardChart";
import ZoomPan from "@/components/layout/ZoomPan";
import MapTH, { mapTH_potDataInterface } from "@/data/svg/map_th";
import { FilterContext } from "@/data/context/filter";
import { RootState } from "@/store";
import { getCurrentIndexFilterRegionalHealth, getCurrentIndexIndicator } from "@/store/slices/navbarSlice";
import { ListLabelIndicator } from "@/data/indicator";
import { LeftSideData } from "./LeftSideData";
import ProvinceClickedData from "./ProvinceClickData";
import { XverServices } from "@/services/api/hospital/dashboard";
import { getDataMap, setDataMap } from "@/store/slices/mapSlice";
import ProvinceData from '@/data/json/mock_province.json';
import { regional_health } from "@/data/dict/regional_health";
import { MapContext } from "@/data/context/map";
import { _class, findRegionHealthNameByProvinceName } from "@/utils/helpers/functions";
import { itemOfIndicator } from "@/interfaces/type/map";
import ColorDict from "./ColorDict";
import ModalHospital from "./modalHospital";
import { useDisclosure } from "@mantine/hooks";

type LowValueRangeType = [number, number | null]
type HighValueRangeType = [number | null, number]

export default function MapReport() {

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isVeryBigScreen = useMediaQuery({ query: '(min-width: 2400px)' })
    // stores
    const dataMap = useSelector((state: RootState) => getDataMap(state))
    const currentIndexFilterRegionalHealth = useSelector((state: RootState) => getCurrentIndexFilterRegionalHealth(state))
    // states for map context
    const refContainerHoverMap = useRef<HTMLDivElement>(null)
    const [provinceHoverInMap, setProvinceHoverInMap] = useState<string>('')
    const [isHoverProvinceInMap, setIsHoverProvinceInMap] = useState<boolean>(false)
    const [containerSideProvinceData, setContainerSideProvinceData] = useState<boolean>(false)
    // state : normal
    const [dataMapForMapTH, setDataMapForMapTH] = useState<mapTH_potDataInterface[]>([])
    const [statusReadyPaintColor, setStatusReadyPaintColor] = useState<boolean>(false)
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
        errorMsg: ''
    });
    // others
    const { ...filter_context } = useContext(FilterContext)
    const { ...map_context } = useContext(MapContext)
    const currentIndexIndicator = useSelector((state: RootState) => getCurrentIndexIndicator(state))
    const dispatch = useDispatch();
    // ["#00af50", "#c5e0b5", "#fee79b", "#f8cbac", "#f88980", "#a8a8a8"]
    // const [color, setColor] = useState<IColorModel[]>([]);
    const [openedModalHospital, { open: openModalHospital, close: closeModalHospital }] = useDisclosure(false);

    const localColor = ["#00af50", "#c5e0b5", "#fee79b", "#f8cbac", "#f88980", "#a8a8a8"];
    // const localColor = ["#f88980", "#f8cbac", "#fee79b", "#c5e0b5", "#00af50", "#a8a8a8"]

    const FetchMap = () => {
        XverServices.Map(
            filter_context.regional_health.id, 
            filter_context.indicator.value,
            filter_context.year.value
        ).then(res => {
            if (res.status_code == 200) {
                dispatch(setDataMap(res.data));
                setLoading(prev => ({
                    ...prev,
                    state: false,
                }))
                setStatusReadyPaintColor(true)
            } else {
                throw res;
            }
        }).catch((err) => {
            console.log(err);
            setLoading(prev => ({
                ...prev,
                errorState: true,
            }))
        });
    }

    const FetchColor = () => {
        XverServices.Color().then(res => {
            if (res.status_code == 200) {
                // setColor(res.data);
                // console.log(res.data.map((item: any) => item.color))
                setLoading(prev => ({ ...prev, state: false }))
            } else {
                throw res;
            }
        }).catch((err) => {
            console.log(err);
            setLoading(prev => ({
                ...prev,
                errorState: true,
            }))
        });
    }

    const select_province_value = (): string => {
        let avg = 0
        const provinces = dataMap.filter(item => item.province_name.includes(provinceHoverInMap))
        const sum = provinces.reduce((result, item) => result += item.value, 0);
        avg = sum / provinces.length
        return isNaN(avg) ? 'N/A' : avg.toFixed(2);
    }

    const set_map = () => {
        const tmpDataMapForMapTH: mapTH_potDataInterface[] = [];
        if (filter_context.regional_health.id == 0 && filter_context.map.view_by.state == 'regional_health') {
            ProvinceData.map((item) => {
                const hospitals = dataMap.filter(item2 => parseInt(item2.service_zone.slice(3)) == item.region_health_key);
                const sum = hospitals.reduce((result, item2) => result += item2.value, 0);
                const cmi = sum / hospitals.length;
                // if (filter_context.regional_health.id == 2) {
                //     console.log('cmi', cmi)
                // }
                tmpDataMapForMapTH.push({
                    province_name: item.name,
                    value: isNaN(cmi) ? 0 : cmi,
                    color: cal_color(cmi, filter_context.indicator.value),
                });
            });
        } else {
            ProvinceData.map((item) => {
                const hospitals = dataMap.filter(item2 => item2.province_name.includes(item.name));
                const sum = hospitals.reduce((result, item2) => result += item2.value, 0);
                const cmi = sum / hospitals.length;
                tmpDataMapForMapTH.push({
                    province_name: item.name,
                    value: isNaN(cmi) ? 0 : cmi,
                    color: cal_color(cmi, filter_context.indicator.value),
                });
            });
        }
        setDataMapForMapTH(tmpDataMapForMapTH)
    }

    const getColorDict = (option: itemOfIndicator) => {
        switch (option) {
            case "CMI":
                return <ColorDict
                    key={option}
                    label={`%CMI`}
                    colorDict={[
                        { color: localColor[0], range: "90 - 100" },
                        { color: localColor[1], range: "80 - 90" },
                        { color: localColor[2], range: "70 - 80" },
                        { color: localColor[3], range: "60 - 70" },
                        { color: localColor[4], range: "< 60" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Incident":
                return <ColorDict
                    key={option}
                    label={`% E up`}
                    colorDict={[
                        { color: localColor[0], range: "< 3" },
                        { color: localColor[1], range: "3 - 5" },
                        { color: localColor[2], range: "5 - 7" },
                        { color: localColor[3], range: "7 - 9" },
                        { color: localColor[4], range: "> 9" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Accreditation":
                return <ColorDict
                    key={option}
                    label={`Score`}
                    colorDict={[
                        { color: localColor[0], range: "> 3.5" },
                        { color: localColor[1], range: "3 - 3.5" },
                        { color: localColor[2], range: "2.5 - 3" },
                        { color: localColor[3], range: "1.5 - 2.5" },
                        { color: localColor[4], range: "< 1.5" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Environment Safety Score":
                return <ColorDict
                    key={option}
                    label={`%ENV`}
                    colorDict={[
                        { color: localColor[0], range: "90 - 100" },
                        { color: localColor[1], range: "80 - 90" },
                        { color: localColor[2], range: "70 - 80" },
                        { color: localColor[3], range: "60 - 70" },
                        { color: localColor[4], range: "< 60" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Bed Occupancy":
                return <ColorDict
                    key={option}
                    label={`%Bed Occ`}
                    colorDict={[
                        { color: localColor[0], range: "80 - 100" },
                        { color: localColor[1], range: "70 - 80" },
                        { color: localColor[2], range: "60 - 70" },
                        { color: localColor[3], range: "< 60" },
                        { color: localColor[4], range: "> 100" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Death Rate":
                return <ColorDict
                    key={option}
                    label={`Death Rate`}
                    colorDict={[
                        { color: localColor[0], range: "< 5" },
                        { color: localColor[1], range: "5 - 10" },
                        { color: localColor[2], range: "10 - 15" },
                        { color: localColor[3], range: "15 - 20" },
                        { color: localColor[4], range: "> 20" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "Infection Rate":
                return <ColorDict
                    key={option}
                    label={`Infection rate`}
                    colorDict={[
                        { color: localColor[0], range: "< 2" },
                        { color: localColor[1], range: "2 - 4" },
                        { color: localColor[2], range: "4 - 7" },
                        { color: localColor[3], range: "7 - 10" },
                        { color: localColor[4], range: "> 10" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            case "PE / PS":
                return <ColorDict
                    key={option}
                    label={`PS/PE`}
                    colorDict={[
                        { color: localColor[0], range: "90 - 100" },
                        { color: localColor[1], range: "80 - 90" },
                        { color: localColor[2], range: "70 - 80" },
                        { color: localColor[3], range: "60 - 70" },
                        { color: localColor[4], range: "< 60" },
                        { color: localColor[5], range: "N/A" },
                    ]}
                />

            default:
                return <ColorDict
                    colorDict={[
                        { color: "#a8a8a8", range: "N/A" },
                    ]}
                />
        }
    }

    const checkRangeValueToLow = (value: number, min: number, max: number | null) => {
        if (max != null) {
            return (min <= value && value < max)
        } else {
            return min <= value
        }
    }

    const checkRangeValueToHigh = (value: number, min: number | null, max: number) => {
        if (min != null) {
            return (min <= value && value < max)
        } else {
            return max > value
        }
    }

    const cal_color = (value: number | null, option: itemOfIndicator): string => {
        let result = "";
        if (value == null || isNaN(value)) {
            return result = localColor[5];
        }
        switch (option) {
            case "CMI":
                const rangeCMI: LowValueRangeType[] = [[90, 1000], [80, 90], [70, 80], [60, 70], [0, 60]]
                rangeCMI.map((item, index) => {
                    if (checkRangeValueToLow(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Incident":
                const rangeIncident: HighValueRangeType[] = [[null, 3], [3, 5], [5, 7], [7, 9], [9, 1000]]
                rangeIncident.map((item, index) => {
                    if (checkRangeValueToHigh(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Accreditation":
                const rangeAccreditation: LowValueRangeType[] = [[3.5, 100], [3, 3.5], [2.5, 3], [1.5, 2.5], [0, 1.5]]
                rangeAccreditation.map((item, index) => {
                    if (checkRangeValueToLow(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Environment Safety Score":
                const rangeENV: LowValueRangeType[] = [[90, 1000], [80, 90], [70, 80], [60, 70], [0, 60]]
                rangeENV.map((item, index) => {
                    if (checkRangeValueToLow(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Bed Occupancy":
                const rangeBED: LowValueRangeType[] = [[80, 100], [70, 80], [60, 70], [0, 60]]
                if (value > 100) return result = localColor[4]
                rangeBED.map((item, index) => {
                    if (checkRangeValueToLow(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Death Rate":
                const rangeDeath: HighValueRangeType[] = [[null, 5], [5, 10], [10, 15], [15, 20], [20, 1000]]
                rangeDeath.map((item, index) => {
                    if (checkRangeValueToHigh(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "Infection Rate":
                const rangeInfection: HighValueRangeType[] = [[null, 2], [2, 4], [4, 7], [7, 10], [10, 100]]
                rangeInfection.map((item, index) => {
                    if (checkRangeValueToHigh(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
            case "PE / PS":
                const rangePEPS: LowValueRangeType[] = [[90, 1000], [80, 90], [70, 80], [60, 70], [0, 60]]
                rangePEPS.map((item, index) => {
                    if (checkRangeValueToLow(value, item[0], item[1])) {
                        return result = localColor[index]
                    }
                })
                break;
        }
        return result;
    }

    const handleToggleSwitch = () => {
        filter_context.map.view_by.setState(
            filter_context.map.view_by.state == 'regional_health'
            ? 'province' : 'regional_health'
        )
    }

    useEffect(() => {
        set_map()
    }, [filter_context.map.view_by.state])

    useEffect(() => {
        if (dataMap === null) {
            setLoading(prev => ({ ...prev, errorState: true }))
            return
        } else {
            setLoading(prev => ({ ...prev, errorState: false }))
        }
        set_map()
        handleToggleSwitch()
        filter_context.map.view_by.setState('regional_health')
    }, [
        dataMap,
        filter_context.regional_health.id, 
        filter_context.year.value, 
        filter_context.indicator.value,
        containerSideProvinceData,
        map_context.contentSideDataProvince.isOpen,
    ])

    useEffect(() => {
        FetchColor();
    }, [])

    useEffect(() => {
        FetchMap()
    }, [
        filter_context.indicator.value,
        filter_context.regional_health.id, 
    ])

    useEffect(() => {
        if (filter_context.regional_health.id !== regional_health.thirteen.id) {
            if (!containerSideProvinceData) setContainerSideProvinceData(false)
        }
    }, [
        filter_context.regional_health.id,
        filter_context.year.value,
        filter_context.indicator.value,
    ])


    useEffect(() => {
        setContainerSideProvinceData(false)
    }, [currentIndexFilterRegionalHealth])

    return (

        <>


            <MapContext.Provider 
                value={{
                    refContainerHover: refContainerHoverMap,
                    contentSideDataProvince: {
                        isOpen: containerSideProvinceData,
                        setIsOpen: setContainerSideProvinceData,
                    },
                    hover: {
                        isHover: isHoverProvinceInMap,
                        setHover: setIsHoverProvinceInMap,
                        valueIs: provinceHoverInMap,
                        setValue: setProvinceHoverInMap,
                    },
                }}
            >

                {
                    isHoverProvinceInMap && (
                        <div
                            ref={refContainerHoverMap}
                            className={_class(`
                                absolute z-30 bg-white h-min -top-80 -left-80
                                px-3 pb-2 pt-2.5 rounded-md shadow-md flex flex-col gap-y-0.5
                            `)}
                            onMouseEnter={() => setIsHoverProvinceInMap(true)}
                        >
                            {
                                filter_context.regional_health.id === regional_health.all.id &&
                                <p className={`grid grid-cols-1 w-full text-center text-blue-700 text-sm`}>
                                    { findRegionHealthNameByProvinceName(provinceHoverInMap) }
                                </p>
                            }
                            <div className={`flex items-center justify-between`}>
                                <p className={`mr-6`}>
                                    { provinceHoverInMap.replaceAll('"', '') }
                                </p>
                                <p>
                                    { 
                                        select_province_value()
                                    }
                                </p>
                            </div>
                        </div>
                    )
                }

                <CardChart
                    title={`Hospital indicator \`${ListLabelIndicator[currentIndexIndicator]}\``}
                    subTitle='Last 14 days'
                    className={`w-full relativeoverflow-hidden`}
                    stateLoading={loading.state}
                    stateError={loading.errorState}
                    errorMsg={loading.errorMsg}
                    useRelativeRoot
                    topRight={
                        filter_context.regional_health.id === regional_health.all.id &&
                        <>
                            <div>
                                <Switch
                                    checkedChildren="เฉลี่ยแบบเขต" 
                                    unCheckedChildren="เฉลี่ยแบบรายจังหวัด" 
                                    defaultChecked
                                    style={{
                                        width: 140,
                                        backgroundColor: 
                                            filter_context.map.view_by.state == 'regional_health' 
                                            ? undefined : '#7a29ff',
                                    }}
                                    checked={filter_context.map.view_by.state == 'regional_health'}
                                    onClick={handleToggleSwitch}
                                />
                            </div>
                        </>
                    }
                >


                    

                    <ModalHospital
                        stateModal={{
                            opened: openedModalHospital,
                            close: closeModalHospital,
                            open: openModalHospital,
                        }}
                    />


                    {/* Left sideData list */}
                    <LeftSideData />


                    {/* Color dict */}
                    { getColorDict(filter_context.indicator.value) }


                    {
                        containerSideProvinceData 
                        ? <ProvinceClickedData 
                            mediaQuery={{
                                isBigScreen: isBigScreen,
                                isVeryBigScreen: isVeryBigScreen,
                            }}
                            stateModalHospital={{
                                opened: openedModalHospital,
                                close: closeModalHospital,
                                open: openModalHospital,
                            }}
                        /> 
                        : <div className="wh-full absolute left-0 ">
                            <ZoomPan>
                                <MapTH
                                    zone={filter_context.regional.code}
                                    data={dataMapForMapTH}
                                    statusReadyPaintColor={statusReadyPaintColor}
                                    className='w-full'
                                />
                            </ZoomPan>
                        </div>
                    }


                </CardChart>
            </MapContext.Provider>  
            

        </>

    )


}
