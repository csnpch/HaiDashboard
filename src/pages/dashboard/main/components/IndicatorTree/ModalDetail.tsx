import { FilterContext } from "@/data/context/filter";
import { SubIndicatorsModelMainFiled } from "@/interfaces/api/dashboard";
import { XverServices } from "@/services/api/hospital/dashboard";
import { _class, getRegionalHealthNameFromId } from "@/utils/helpers/functions";
// import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
import { Modal, Table } from "@mantine/core";
import { Collapse } from "antd";
import { useContext, useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { ThreeMapDataResponse } from ".";
import Error from "@/components/Error";
const { Panel } = Collapse;

interface propsInterface {
    stateModal: {
        opened: boolean,
        open: () => void,
        close: () => void,
    },
    dataPot: any,
    dataIndicator: ThreeMapDataResponse,
    keyIndicators: string[],
}


export default function ModalDetailThreeMap(props: propsInterface) {

    const { ...filter_context } = useContext(FilterContext)
    const [onExtractData, setOnExtractData] = useState<boolean>(false)
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
        emptyState: false,
    })
    const [dataIndicator, setDataIndicator] = useState<ThreeMapDataResponse>({
        motolty_model: [],
        infection_model: [],
        ps_and_qc_model: [],
        HPH_model: [],
        HPH_avg: 0,
        motolty_avg: 0,
        infection_avg: 0,
        ps_and_qc_avg: 0,
    })


    const FetchIndicator = async () => {
        try {
            const res: {
                data: ThreeMapDataResponse
            } = await XverServices.Indicators(
                filter_context.regional_health.id, 
                filter_context.map.provinceSelected.state, 
                filter_context.map.hospitalCode.state,
                filter_context.year.value
            )
            const data = res.data

            if (res.data) {
                setDataIndicator(data)
                setLoading(prev => ({
                    ...prev,
                    state: false,
                }))
            }

        } catch (err: any) {
            setLoading(prev => ({
                ...prev,
                errorState: true,
            }))
        }
    }
    

    const handleChangeCollapse = (e: any) => {
        if (e.length === 0) {
            setOnExtractData(false)
            return
        }
        setOnExtractData(true)
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


    return (
        <>
                
            <Modal 
                title={<>
                    <div className={`flex flex-row gap-x-6`}>
                        <p className={``}>
                            Hospital Indicators
                        </p>
                        <div className={`flex items-center gap-x-2 text-red-600 absolute right-16`}>
                            <p className={`flex-center gap-1`}>
                                <HiLocationMarker className='text-rose-600' />
                                { filter_context.map.provinceSelected.state }
                            </p>
                            {
                                filter_context.map.provinceSelected.state !== "" && '/'
                            }
                            <p>
                                { getRegionalHealthNameFromId(filter_context.regional_health.id) }                
                            </p>
                        </div>
                    </div>
                </>}
                opened={props.stateModal.opened} 
                onClose={() => {
                    setOnExtractData(false)
                    props.stateModal.close()
                }} 
                size={
                    onExtractData ? `80%` : `lg`
                } 
                centered
            >
                {
                    loading.state 
                    ? 
                    <p className={`text-center mt-4`}>
                        Loading...
                    </p> 
                    :
                    loading.errorState ? <Error />:<></>
                }
                {
                    (!loading.state && !loading.errorState)
                    && <Collapse onChange={handleChangeCollapse}>
                        {
                            getPanelWithTable(
                                '1', 
                                `HPH (${dataIndicator.HPH_model.length} รพ.)`, 
                                // @ts-ignore
                                dataIndicator.HPH_avg ? dataIndicator.HPH_avg.toFixed(2) : "0.00", 
                                dataIndicator.HPH_model
                            )
                        }
                        {
                            getPanelWithTable(
                                '2', 
                                `Infection (${dataIndicator.infection_model.length} รพ.)`, 
                                // @ts-ignore
                                dataIndicator.infection_avg ? dataIndicator.infection_avg.toFixed(2) : "0.00", 
                                dataIndicator.infection_model
                            )
                        } 
                        {
                            getPanelWithTable(
                                '3', 
                                `Mortality (${dataIndicator.motolty_model.length} รพ.)`, 
                                // @ts-ignore
                                dataIndicator.motolty_avg ? dataIndicator.motolty_avg.toFixed(2) : "0.00", 
                                dataIndicator.motolty_model
                            )
                        } 
                        {
                            getPanelWithTable(
                                '4', 
                                `PS and QC (${dataIndicator.ps_and_qc_model.length} รพ.)`, 
                                // @ts-ignore
                                dataIndicator.ps_and_qc_avg ? dataIndicator.ps_and_qc_avg.toFixed(2) : "0.00", 
                                dataIndicator.ps_and_qc_model
                            )
                        }
                    </Collapse>
                }
            </Modal>

        </>
    );
}



const getPanelWithTable = (key: string, title: string, avg: number, dataTable: any) => {


    const getTHead = (object: any) => {
        try {
            return Object.keys(object).slice(3)
        } catch (err) {
            return []
        }
    }


    const getTBody = (index: number) => {
        try {
            return Object.values(dataTable[index]).slice(3)
        } catch (err) {
            return []
        }
    }


    return (
        <Panel 
            key={key}                    
            header={<>
                <div className={`w-full flex items-center justify-between text-white`}>
                    <p>{title}</p>
                    <p>{avg}</p>
                </div>
            </>}
            showArrow={false}
            className={`bg-[#0891b2] mb-2`} 
        >

            
            {
                dataTable.length === 0 && 
                <p className={`text-center`}>
                    - ไม่มีข้อมูล -
                </p>
            }

            
            {
                dataTable.length !== 0 && 
                <Table>
                    <thead className={`tracking-wider text-black border-b-2 h-10`}>
                        <th 
                            className={`text-center pl-2`}
                            style={{
                                width: '5%',
                            }}
                        >
                            ลำดับ
                        </th>
                        <th className={`text-left pl-2.5`}>
                            โรงพยาบาล
                        </th>
                        <th className={`text-left pl-2.5`}>
                            รวม
                        </th>
                        {
                            getTHead(dataTable[0]).map((item, index) => {
                                return (
                                    <th 
                                        key={index} 
                                        className={`text-left tracking-wider`}
                                    >
                                        { item }
                                    </th>
                                )
                            })
                        }
                    </thead>
                    <tbody>
                        {
                            // {"Float64":57.65999984741211,"Valid":True}
                            dataTable.map((valRow: SubIndicatorsModelMainFiled, indexRow: number) => {
                                return (
                                    <tr 
                                        key={indexRow}
                                        className={_class(`${indexRow % 2 === 0 ? '' : 'bg-gray-100'}`)}
                                    >
                                        <td className={`text-center`}>
                                            { indexRow + 1 }
                                        </td>
                                        <td className={``}>
                                            { valRow.hospital_name }
                                        </td>
                                        <td className={``}>
                                            { valRow.total.Valid ? valRow.total.Float64.toFixed(2) : '-' }
                                        </td>
                                        {
                                            getTBody(indexRow).map((valCol, indexCol) => {
                                                return (
                                                    <td 
                                                        key={indexCol} 
                                                        className={`text-left`}
                                                        style={{
                                                            // @ts-ignore
                                                            opacity: valCol.Valid ? 1 : 0.4,
                                                        }}
                                                    >
                                                        {/* @ts-ignore */}
                                                        { valCol.Valid ? valCol.Float64.toFixed(2) : '-' }
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            }
        </Panel>
    )
}
