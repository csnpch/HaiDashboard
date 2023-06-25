import { FilterContext } from "@/data/context/filter";
import { IStandardsHospitalModel } from "@/interfaces/api/dashboard";
import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
// import { getRegionalHealthNameFromId } from "@/utils/helpers/functions";
import { Modal, ScrollArea, Table } from "@mantine/core";
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
    data: IStandardsHospitalModel[],
}


export default function ModalDetailStandardStackedColumn(props: propsInterface) {
    const { ...filter_context } = useContext(FilterContext)

    const riskGroupList = [...new Set(props.data.map((item) => item.risk_group))].sort()

    const checkZero = (value: number) => {
        if (value != null) return value
        return <span style={{ opacity: 0.4 }}>-</span>
    }

    return (
        <>
                
            <Modal 
                title={
                    <div className={`flex flex-row gap-x-6`}>
                        <p className={``}>
                            Essential standards for safety
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
                }
                opened={props.stateModal.opened} 
                onClose={props.stateModal.close} 
                size={`50vw`} 
                centered
            >
                <ScrollArea w={`100%`} h={`60vh`}>
                    <Collapse>
                        {
                            riskGroupList.map((group, index) => (
                                <Panel 
                                    key={index}
                                        header={
                                        <div className={`w-full flex items-center justify-between text-white`}>
                                            <p className={``}>
                                                {`G000${group}`} - {props.data.find(i => i.risk_group == group)?.risk_name}
                                            </p>
                                            <p className={``}>
                                                {
                                                    [
                                                        ...new Set(
                                                            props.data
                                                                .filter((items) => items.risk_group === group)
                                                                .filter((items) =>
                                                                    items.a_i_value !== null &&
                                                                    items.e_up_value !== null &&
                                                                    items.a_i_edited_value !== null &&
                                                                    items.e_up_edited_value !== null
                                                                )
                                                                .map(item => item.hospital_name)
                                                        )
                                                    ].length
                                                }
                                                &nbsp;รพ.
                                            </p>
                                        </div>
                                    }
                                    className={`
                                        capitalize bg-cyan-600 mb-2
                                    `}
                                >
                                    <Collapse>
                                        {
                                            [
                                                ...new Set(
                                                    props.data
                                                        .filter((item) => item.risk_group === group)
                                                        .map(item => item.risk_code)
                                                )
                                            ].map((item, index) => {

                                                const subItem = props.data
                                                    .filter((items) => items.risk_code === item)
                                                    .filter((items) =>
                                                        items.a_i_value !== null &&
                                                        items.e_up_value !== null &&
                                                        items.a_i_edited_value !== null &&
                                                        items.e_up_edited_value !== null
                                                    )

                                                return (
                                                    <Panel key={index}
                                                        header={
                                                            <div className={`w-full flex items-center justify-between text-black`}>
                                                                <p className={``}>
                                                                    {item}
                                                                </p>
                                                                <p>
                                                                    { subItem.length }
                                                                    &nbsp;รพ.
                                                                </p>
                                                            </div>
                                                        }
                                                        className={`
                                                            capitalize bg-gray-100 mb-2
                                                        `}
                                                    >
                                                        <ScrollArea w={`100%`} h={subItem.length > 8 ? "40vh" : "100%"}>
                                                            <Table>
                                                                <thead
                                                                    className={`text-black border-b-2 shadow-md`} 
                                                                    style={{
                                                                        position: "sticky",
                                                                        top: 0,
                                                                        background: "#fff"
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        <th>No.</th>
                                                                        <th>Hospital Name</th>
                                                                        <th style={{ width: "4em", textAlign: "center" }}>A-I Value</th>
                                                                        <th style={{ width: "4em", textAlign: "center" }}>A-I Edited</th>
                                                                        <th style={{ width: "4em", textAlign: "center" }}>E-UP Value</th>
                                                                        <th style={{ width: "4em", textAlign: "center" }}>E-UP Edited</th>
                                                                    </tr>
                                                                </thead>
    
                                                                <tbody>
                                                                    {
                                                                        subItem.map((items, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{ index + 1} </td>
                                                                                    <td>{ items.hospital_name }</td>
                                                                                    <td>{ checkZero(items.a_i_value) }</td>
                                                                                    <td>{ checkZero(items.a_i_edited_value) }</td>
                                                                                    <td>{ checkZero(items.e_up_value) }</td>
                                                                                    <td>{ checkZero(items.e_up_edited_value) }</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </Table>
                                                        </ScrollArea>
                                                    </Panel>
                                                )
                                            })
                                        }
                                    </Collapse>
                                </Panel>
                            ))
                        }
                    </Collapse>
                </ScrollArea>
            </Modal>

        </>
    );
}