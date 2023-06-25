/* eslint-disable @typescript-eslint/ban-ts-comment */
import CardChart from '@/components/CardChart'
import { Treemap } from '@ant-design/charts'
import {useContext, useEffect, useState} from 'react'
import {XverServices} from "@/services/api/hospital/dashboard"
import { FilterContext } from "@/data/context/filter"
import {IIndicatorsModel} from "@/interfaces/api/dashboard"
import { Badge, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import ModalDetailThreeMap from './ModalDetail'
import { DataTransferObject } from '@/interfaces/api/respose'

interface ApiDataTransferObject extends DataTransferObject {
    data: ThreeMapDataResponse[];
}

export interface ThreeMapDataResponse {
    motolty_model: IIndicatorsModel[],
    infection_model: IIndicatorsModel[],
    ps_and_qc_model: IIndicatorsModel[],
    HPH_model: IIndicatorsModel[],
    HPH_avg?: number,
    infection_avg?: number,
    motolty_avg?: number,
    ps_and_qc_avg?: number,
}


export default function IndicatorTreemap() {

    const [dataIndicator, setDataIndicator] = useState<ThreeMapDataResponse[]>([])
    const { ...filter_context } = useContext(FilterContext)
    const [openedModalTreeMap, { open: openModalTreeMap, close: closeModalTreeMap }] = useDisclosure()
    const [hCount, setHCount] = useState(0)
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
        emptyState: false,
    })
    
    const FetchIndicator = async () => {
        XverServices.Indicators(
            filter_context.regional_health.id, 
            filter_context.map.provinceSelected.state, 
            filter_context.map.hospitalCode.state,
            filter_context.year.value
        ).then((res: ApiDataTransferObject) => {
            if (res.status_code == 200) {
                setDataIndicator(res.data)
                setLoading(prev => ({
                    ...prev,
                    state: false,
                }))
            } else {
                throw res
            }
        }).catch((err) => {
            console.log(err)
            setLoading(prev => ({
                ...prev,
                errorState: true,
            }))
        })
    }

    const get_data_indicators = (column: any) => {
        const result: any = []
        if (dataIndicator[column]) {
            // @ts-ignore
            if (dataIndicator[column].length > 0) {
                // @ts-ignore
                Object.keys(dataIndicator[column][0]).filter(item => item.length === 6).map(item => {
                    let avg = 0
                    // @ts-ignore
                    const sum = dataIndicator[column].reduce((total, item2) => total += item2[item].Float64, 0)
                    // @ts-ignore
                    const hospital_count = dataIndicator[column].length
                    avg = sum / hospital_count
                    result.push({
                        name: item,
                        value: avg.toFixed(2),
                    })
                })
            }
        }
        return result
    }

    const keyIndicators = ['motolty_model', 'infection_model', 'ps_and_qc_model', 'HPH_model']

    
    const data = {
        name: 'Indicators',
        children:[
            {
                // @ts-ignore
                name: 'Mortality' + ` ( ${dataIndicator.motolty_model?.length} รพ.)`,
                children: get_data_indicators(keyIndicators[0]),
            },
            {
                // @ts-ignore
                name: 'Infection' + ` ( ${dataIndicator.infection_model?.length} รพ. )`,
                children: get_data_indicators(keyIndicators[1]),
            },
            {
                // @ts-ignore
                name: 'PS and QC' + ` ( ${dataIndicator.ps_and_qc_model?.length} รพ. )`,
                children: get_data_indicators(keyIndicators[2]),
            },
            {
                // @ts-ignore
                name: 'HPH' + ` ( ${dataIndicator.HPH_model?.length} รพ. )`,
                children: get_data_indicators(keyIndicators[3])
            },
        ]
    }

    const cal_hospital_count = async () => {
        try {
            let max = 0
            for (const item of keyIndicators) {
                // @ts-ignore
                if (dataIndicator[item].length > max) {
                    // @ts-ignore
                    max = dataIndicator[item].length
                }
            }
            setHCount(max)
        } catch (_) { }
    }

    const HospitalCount = () => {
        return (
            <Badge
                variant={`outline`}
                color={`gray`}
                size={`sm`}
                className={`absolute bottom-1 left-1 text-inherit`}
                style={{ height: "22px" }}
            >
                โรงพยาบาลที่มีข้อมูล: { hCount  }
            </Badge>
        )
    }


    const triggerFetch = () => { 
        FetchIndicator()
        setLoading(prev => ({
            ...prev,
            state: true,
            errorState: false,
        }))
    }

    
    useEffect(() => {
        FetchIndicator()
    }, [
        filter_context.map.provinceSelected.state, 
        filter_context.regional_health.id, 
        filter_context.map.hospitalCode.state,
        filter_context.year.value,
        filter_context.indicator.value
    ])


    useEffect(() => {
        cal_hospital_count()
    }, [dataIndicator])


    return (
        <>


            <ModalDetailThreeMap 
                stateModal={{
                    opened: openedModalTreeMap,
                    open: openModalTreeMap,
                    close: closeModalTreeMap,
                }}
                // @ts-ignore
                dataIndicator={dataIndicator}
                dataPot={data}
                keyIndicators={keyIndicators}
            />


            <CardChart
                title="Hospital Indicators"
                stateLoading={loading.state}
                stateError={loading.errorState}
                stateEmptyData={
                    get_data_indicators('motolty_model').length === 0
                    && get_data_indicators('infection_model').length === 0
                    && get_data_indicators('ps_and_qc_model').length === 0
                    && get_data_indicators('HPH_model').length === 0
                }
                triggerFetch={triggerFetch}
            >

                <div className={`wh-full -mt-2`}>

                    <Treemap
                        data={data}
                        style={{
                            width: '94%',
                            height: '90%',
                            margin: '0 auto',
                        }}
                        interactions={[
                            {
                                type: 'treemap-drill-down',
                            },
                        ]}
                        drilldown={{
                            enabled: true,
                            breadCrumb: {
                                rootText: 'Indicators',
                                position: 'top-left',
                            }
                        }}
                        legend={false}
                        color={["#FF7F50", "#87CEFA", "#DA70D6", "#32CD32", "#6495ED", "#FF69B4", "#BA55D3", "#CD5C5C", "#FFA500", "#40E0D0", "#1E90FF", "#FF6347"]}
                        label={{
                            content: (data) => {
                                if (
                                    data.name.includes('PS and QC')
                                    || data.name.includes('HPH')
                                    || data.name.includes('Infection')
                                    || data.name.includes('Mortality')
                                ) return data.name
                                return `${data.name}\n${data.value}`
                            },
                            // formatter: (data, event) => {
                            //     console.log(data)
                            //     let avg = data.value
                            //     if (event.nextPoints === undefined) {
                                    
                            //         let values: number[] = []
                            //         data.children.map((item: any) => values.push(item.value))

                            //         values = values.filter((item: number) => item !== 0.00)
                            //         let sum = values.reduce((total: number, item: number) => total += item, 0)

                            //         avg = sum / values.length
                            //     }
                                
                            //     return (
                            //         `${data.name}\n${
                            //             data.name.includes('PS and QC') ?    
                            //             '' : avg.toFixed(2)
                            //         }`
                            //     )
                                
                            // },
                            style: {
                                fill: `inherit`,
                                fontSize: 12,
                            }
                        }}
                        tooltip={{
                            formatter: (dataOnTooltip) => {
                                try {
                                    const findSomthing = Object.values(data.children).find((item: any) => item.name === dataOnTooltip.name)
                                    if (findSomthing?.name.includes('PS and QC')) return {
                                        name: dataOnTooltip.name,
                                        value: ''
                                    }

                                    const cleanZeroVal = findSomthing?.children.filter((item: any) => item.value !== '0.00')
                                    const sum = cleanZeroVal.reduce((total: any, item: any) => total += parseFloat(item.value || '0'), 0)
                                    const avg = sum / cleanZeroVal.filter((item: any) => item !== 0.00 || item !== '0.00').length
                                    
                                    if (isNaN(sum) || isNaN(avg)) throw new Error('error')
                                    return {
                                        name: dataOnTooltip.name,
                                        value: `AVG: ${avg.toFixed(2)}`
                                    }
                                } catch (_) {
                                    return {
                                        name: dataOnTooltip.name,
                                        value: dataOnTooltip.value
                                    }
                                }
                            }
                        }}
                        animation
                    />

                </div>

                <HospitalCount />

                <Button 
                    className={`absolute right-1 bottom-1 rounded-3xl bg-[#6395f9] hover:bg-[#4681f7]`} 
                    variant={`filled`} 
                    size="xs" 
                    onClick={openModalTreeMap}
                    style={{ height: "22px" }}
                >
                    Detail
                </Button>

            </CardChart>



        </>
    )
}