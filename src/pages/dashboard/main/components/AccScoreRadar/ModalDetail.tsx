import { FilterContext } from "@/data/context/filter";
import { IScoreHospitalModel } from "@/interfaces/api/dashboard";
import { DataTransferObject } from "@/interfaces/api/respose";
import { XverServices } from "@/services/api/hospital/dashboard";
import { _class, getRegionalHealthNameFromId } from "@/utils/helpers/functions";
import { Modal, ScrollArea, Table } from "@mantine/core";
import { useCallback, useContext, useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";


interface propsInterface {
    stateModal: {
        opened: boolean,
        open: () => void,
        close: () => void,
    },
    data: string[]
}

interface ApiDataTransferObject extends DataTransferObject {
    data: IScoreHospitalModel[];
}


export default function ModalDetailAccScoreRadar(props: propsInterface) {
    const { ...filter_context } = useContext(FilterContext)
    const [data, setData] = useState<IScoreHospitalModel[]>([])

    const fetchData = useCallback(async () => {
        let province = ""
        if (filter_context.map.provinceSelected.state != "") province = filter_context.map.provinceSelected.state
        try {
            const res: ApiDataTransferObject = await XverServices.ScoreHospital(
                filter_context.regional_health.id,
                province,
                filter_context.map.hospitalCode.state,
                filter_context.year.value,
            )

            if (res.status_code == 200) {
                const resData = res.data
                if (resData) {
                    setData(resData)
                }
            } else {
                throw res.error
            }

        } catch (error) { /* empty */ }
    }, [filter_context.map.hospitalCode.state, filter_context.map.provinceSelected.state, filter_context.regional_health.id, filter_context.year.value])

    useEffect(() => {
        fetchData()
    }, [filter_context.regional_health.id, filter_context.map.provinceSelected.state, filter_context.map.hospitalCode.state, filter_context.year.value, fetchData])

    return (
        <>  
            <Modal 
                title={<>
                    <div className={`flex flex-row gap-x-6`}>
                        <p>Score for accreditation</p>
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
                    props.stateModal.close()
                }} 
                size={`50vw`} 
                centered
            >
                <ScrollArea w={`100%`} h={`60vh`}>
                    <Table className={`px-10 w-full`}>
                        <thead
                            className={`text-black border-b-2 shadow-md`} 
                            style={{
                                position: "sticky",
                                top: 0,
                                background: "#fff"
                            }}
                        >
                            <tr className={`text-center`}>
                                <th>No.</th>
                                <th style={{ minWidth: "15em" }}>Hospital Name</th>
                                <th style={{ width: "6em", textAlign: "center" }}>Score</th>
                                {
                                    props.data.filter(item => item.includes("IV") && item !== "I-3 PCM").map((item, index) => (
                                        <th key={index} style={{ minWidth: "4em", textAlign: "center" }}>{ item }</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index} className={_class((index % 2 == 0) ? `bg-gray-100` : ``)}>
                                        <td>{ index + 1 }</td>
                                        <td title={item.HospitalName}>{ item.HospitalName }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_average.toFixed(2) }</td>
                                        {/* <td style={{ textAlign: "center" }}>{ item.i_3_pcm.toFixed(2) }</td> */}
                                        <td style={{ textAlign: "center" }}>{ item.iv_1_hcr.toFixed(2) }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_2_cfr.toFixed(2) }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_3_wfr.toFixed(2) }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_4_ldr.toFixed(2) }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_5_wpr.toFixed(2) }</td>
                                        <td style={{ textAlign: "center" }}>{ item.iv_6_fnr.toFixed(2) }</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </ScrollArea>
            </Modal>

        </>
    );
}