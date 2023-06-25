import { FilterContext } from "@/data/context/filter";
import { IPEPSHospitalModel } from "@/interfaces/api/dashboard";
import { _class, getRegionalHealthNameFromId } from "@/utils/helpers/functions";
// import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
import { Modal, ScrollArea, Table } from "@mantine/core";
import { useContext } from "react";
import { HiLocationMarker } from "react-icons/hi";


interface propsInterface {
    stateModal: {
        opened: boolean,
        open: () => void,
        close: () => void,
    },
    data: IPEPSHospitalModel[],
}


export default function ModalDetailPEPSSunburst(props: propsInterface) {
    const { ...filter_context } = useContext(FilterContext)

    return (
        <Modal 
            title={<>
                <div className={`flex flex-row gap-x-6`}>
                    <p className={``}>
                        Patient Satisfaction & Patient Experience
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
            onClose={props.stateModal.close} 
            size={`50vw`} 
            centered
        >
            <ScrollArea w={`100%`} h={`60vh`}>
                <Table className={`px-10`}>
                    <thead 
                        className={`tracking-wider text-black border-b-2`}
                        style={{
                            position: "sticky",
                            top: 0,
                            background: "#fff"
                        }}    
                    >
                        <tr>
                            <th className={`text-left`}>
                                No.
                            </th>
                            <th className={`text-left`}>
                                Hospital Name
                            </th>
                            <th style={{ textAlign: "center" }}>
                                PS
                            </th>
                            <th style={{ textAlign: "center" }}>
                                PE
                            </th>
                            <th style={{ textAlign: "center" }}>
                                Average
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.length > 0 
                            ? props.data.map((e, i) => (
                                <tr key={i} className={_class(`${i % 2 == 0 ? `bg-gray-100` : ``}`)}>
                                    <td className={`text-left`}>
                                        { i + 1}
                                    </td>
                                    <td className={`text-left`}>
                                        { e.hospital_name }
                                    </td>
                                    <td className={`text-center`}>
                                        {/* @ts-ignore */}
                                        { e.ps.Float64.toFixed(2) }
                                    </td>
                                    <td className={`text-center`}>
                                        {/* @ts-ignore */}
                                        { e.pe.Float64.toFixed(2) }
                                    </td>
                                    <td className={`text-center`}>
                                        {/* @ts-ignore */}
                                        { e.avg.toFixed(2) }
                                    </td>
                                </tr>
                            ))
                            : <tr className={`text-center`}>
                                <td colSpan={5}>
                                    <br />
                                    - No Data -
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table>
            </ScrollArea>
        </Modal>
    );
}