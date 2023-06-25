import { FilterContext } from "@/data/context/filter";
import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
// import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
import { Modal, Table } from "@mantine/core";
import { Collapse } from "antd";
import { useContext, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
const { Panel } = Collapse;


interface propsInterface {
    stateModal: {
        opened: boolean,
        open: () => void,
        close: () => void,
    },
}


export default function ModalDetailRadarChart(props: propsInterface) {


    const { ...filter_context } = useContext(FilterContext)
    const [onExtractData, setOnExtractData] = useState<boolean>(false)


    return (
        <>
                
            <Modal 
                title={<>
                    <div className={`flex flex-row gap-x-6`}>
                        <p className={``}>
                            Indicator of clinical outcome
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
                <Collapse onChange={undefined}>
                    {
                        [1,2,3,4].map((
                            _item: any, 
                            index: number
                        ) => {
                            return (
                                <Panel 
                                    key={index}
                                    header={<>
                                        <div className={`w-full flex items-center justify-between text-white`}>
                                            <p>{ 'listPot.name' }</p>
                                            <p>{ 'AVG' }</p>
                                        </div>
                                    </>}
                                    showArrow={false}
                                    className={`
                                        capitalize bg-[#0891b2] mb-2
                                    `}
                                >
                                    {
                                        true 
                                        ?
                                        <Table>
                                            <thead className={`tracking-wider text-black border-b-2`}>
                                                <th 
                                                    className={`text-center pl-2`}
                                                    style={{
                                                        width: '5%',
                                                    }}
                                                >
                                                    ลำดับ
                                                </th>
                                                <th className={`flex pl-2.5`}>
                                                    โรงพยาบาล
                                                </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Hi1</td>
                                                    <td>Hi2</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        :
                                        <p className={`text-center`}>
                                            - ไม่มีข้อมูล -
                                        </p>
                                    }
                                </Panel>
                            )
                        })
                    }
                </Collapse>
            </Modal>

        </>
    );
}