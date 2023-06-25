import CardChart from "@/components/CardChart";
import { FilterContext } from "@/data/context/filter";
import { DataTransferObject } from "@/interfaces/api/respose";
import { IStandardsHospitalModel, IStandardsModel } from "@/interfaces/api/dashboard";
import { XverServices } from "@/services/api/hospital/dashboard";
import { Column, ColumnConfig } from "@ant-design/charts"
import { Badge, Button, Grid, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import ModalDetailStandardStackedColumn from "./ModalDetail";

interface DataInterface {
    risk_group: string,
    risk_name: string,
    risk_code: string,
    value: number,
    key: string,
}

interface ApiDataTransferObject extends DataTransferObject {
    data: IStandardsModel[];
}


export default function StandardStackedColumn() {
    const { ...filter_context } = useContext(FilterContext)

    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
        emptyState: false,
    });
    const [apiData, setApiData] = useState<IStandardsModel[]>([]);
    const [data, setData] = useState<DataInterface[]>([]);
    const [modalData, setModalData] = useState<{
        data: DataInterface[],
        title: string, key: string
    }>();
    const [hospitalModalData, setHospitalModalData] = useState<IStandardsHospitalModel[]>([]);
    const [openedData, { open: openData, close: closeData }] = useDisclosure();
    const [opened, { open, close }] = useDisclosure();

    useEffect(() => {
        fetchData()
        fetchModalData()
    }, [
        filter_context.regional_health.id,
        filter_context.map.provinceSelected.state, 
        filter_context.map.hospitalCode.state,
        filter_context.year.value,
        filter_context.indicator.value
    ])

    const fetchData = async () => {
        try {
            const res: ApiDataTransferObject = await XverServices.Standards(
                filter_context.regional_health.id,
                filter_context.map.provinceSelected.state,
                filter_context.map.hospitalCode.state,
                filter_context.year.value
            )

            if (res.status_code === 200) {
                const resData = res.data
                if (resData) {
                    if (resData.length == 0) return setLoading({ ...loading, state: false, emptyState: true })
                    const temp = await resData.sort((a: any, b: any) => a.risk_group.localeCompare(b.risk_group))
                    setApiData(temp)
                    setData(dataBuild(temp))
                    setLoading({ ...loading, state: false, emptyState: false })
                } else {
                    setLoading({ ...loading, state: false, emptyState: true })
                }
            } else {
                throw new Error(res.message)
            }
        } catch (_: unknown) {
            setLoading({ ...loading, errorState: true })
        }
    }

    const fetchModalData = async () => {
        try {
            const res = await XverServices.StandardsHospital(
                filter_context.regional_health.id,
                filter_context.map.provinceSelected.state,
                filter_context.map.hospitalCode.state,
            )

            if (res.status_code === 200) {
                setHospitalModalData(res.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getGroup = (data: IStandardsModel[]) => {
        let total = 0;
        const groups: string[] = []
        data.forEach((item) => {
            total += item.count;
            if (!groups.includes(item.risk_group)) {
                groups.push(item.risk_group)
            }
        })
        groups.sort()
        return groups
    }

    const dataBuild = (data: IStandardsModel[]) => {
        const groups = getGroup(data)
        const res: DataInterface[] = []
        groups.map((group) => {
            const groupData = data.filter((item) => item.risk_group == group)
            groupData.map((item) => {
                const risk_group = `G000${item.risk_group}`
                const { risk_name, risk_code } = item

                res.push({
                    risk_group, risk_code, risk_name,
                    value: (item.a_i_value - item.a_i_edited_value - item.e_up_value + item.e_up_edited_value),
                    key: "A-I"
                }, {
                    risk_group, risk_code, risk_name,
                    value: (item.a_i_edited_value - item.e_up_edited_value),
                    key: "A-I Edited"
                }, {
                    risk_group, risk_code, risk_name,
                    value: (item.e_up_value - item.e_up_edited_value),
                    key: "E-UP"
                }, {
                    risk_group, risk_code, risk_name,
                    value: item.e_up_edited_value,
                    key: "E-UP Edited"
                })
            })
        })
        return res
    }

    const CustomColumn = (props: ColumnConfig) => {
        return (
            <Column
                isStack={true}
                seriesField="key"
                groupField="value"
                style={{
                    width: '96%',
                    height: '96%',
                    margin: '0 auto',
                }}
                legend={false}

                yAxis={{
                    field: 'value',
                    label: {
                        formatter: (value: string) => parseInt(value).toLocaleString(),
                    },
                    grid: {
                        line: {
                            style: {
                                strokeOpacity: 1
                            }
                        }
                    }
                }}
                animation

                {...props}

            />
        )
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
                โรงพยาบาลที่มีข้อมูล: {
                    [...new Set(
                        hospitalModalData.map((item) => item.hospital_name)
                    )].length
                }
            </Badge>
        )
    }

    const ChildrenTooltip = ({ data }: {
        data: any[]
    }) => {
        if (data.length == 2) {
            return (
                <Grid>
                    <Grid.Col span={9}>
                        { data[0] }
                    </Grid.Col>
                    <Grid.Col span={1} className={`font-medium`}>
                        { data[1] }
                    </Grid.Col>
                </Grid>
            )
        } else {
            return (
                <Grid>
                    <Grid.Col span={5}>
                        { data[0] }
                    </Grid.Col>
                    <Grid.Col span={4} className={`font-medium`}>
                        { data[1] }
                    </Grid.Col>
                    <Grid.Col span={1} className={`font-medium`}>
                        { data[2] }
                    </Grid.Col>
                </Grid>
            )
        }
    }

    const CustomTooltip = (title: string, argData: IStandardsModel[]) => {
        const baseData = argData.reduce((acc, cur) => acc + cur.a_i_value, 0)
        const editedData = argData.reduce((acc, cur) => acc + cur.a_i_edited_value, 0)

        const EUP = argData.reduce((acc, cur) => acc + cur.e_up_value, 0)
        const EUPEdited = argData.reduce((acc, cur) => acc + cur.e_up_edited_value, 0)

        const AIEditedPercentage = ((editedData / baseData) * 100)
        const EUPPercentage = ((EUP / baseData) * 100)
        const EUPEditedPercentage = ((EUPEdited / EUP) * 100) || 0

        return (
            <div className={`rounded-xl px-1.2 py-2 pb-3`} style={{ width: "16em" }}>
                <div className={`text-base font-medium mb-1`}>{title}</div>

                <ChildrenTooltip data={["A-I Total", baseData]} />
                <ChildrenTooltip data={["A-I Edited", `${AIEditedPercentage.toFixed(2)} %`, editedData.toLocaleString()]} />
                <ChildrenTooltip data={["E-Up Total", `${EUPPercentage.toFixed(2)} %`, EUP.toLocaleString()]} />
                <ChildrenTooltip data={["E-Up Edited", `${EUPEditedPercentage.toFixed(2)} %`, EUPEdited.toLocaleString()]} />
            </div>
        )
    }

    const setInteraction = (label: string) => {
        const temp = data.filter((item) => item.risk_group == label || item.risk_code == label);
        setModalData({ data: temp, title: `${label} - ${temp[0].risk_name}`, key: temp[0].risk_group })
        open()
    }

    const triggerFetch = () => {
        setLoading({ ...loading, state: true })
        fetchData()
    }


    useEffect(() => {

        // console.log('data:NRLS', data)
        // console.log('apiData:NRLS', apiData)

    }, [data, apiData])


    return (
        <>
            <CardChart
                title="Essential standards for safety"
                stateLoading={loading.state}
                stateError={loading.errorState}
                stateEmptyData={loading.emptyState}
                triggerFetch={triggerFetch}
            >
                <div className={`wh-full pb-0 pt-3 relative`}>

                    <CustomColumn
                        data={data}
                        xField="risk_group"
                        yField="value"
                        interactions={[
                            {
                                type: 'axis-label-highlight',
                                cfg: {
                                    start: [
                                        {
                                            trigger: 'interval:mouseenter',
                                            action: ['cursor:pointer', 'axis-label-highlight:highlight']
                                        },
                                        {
                                            trigger: 'axis-label:mouseenter',
                                            action: ['cursor:pointer', 'axis-label-highlight:highlight', 'element-highlight:highlight', 'tooltip:show']
                                        },
                                        {
                                            trigger: 'axis-label:click',
                                            action: ({ event }: {
                                                event: {
                                                    gEvent: {
                                                        propagationPath: {
                                                            cfg: {
                                                                id: string
                                                            }
                                                        }[]
                                                    }
                                                }
                                            }) => {
                                                const label: string = event.gEvent.propagationPath[0].cfg.id
                                                const risk_group = label.split('-').at(-1)?.toString()
                                                setInteraction(risk_group || label)
                                            }
                                        },
                                        {
                                            trigger: 'element:click',
                                            action: ({ event }: {
                                                event: {
                                                    data: {
                                                        data: DataInterface
                                                    }
                                                }
                                            }) => {
                                                const risk_group = event.data.data.risk_group
                                                setInteraction(risk_group)
                                            }
                                        }
                                    ],
                                    end: [
                                        { 
                                            trigger: 'interval:mouseleave', 
                                            action: ['cursor:default', 'axis-label-highlight:reset', 'element-highlight:reset', 'tooltip:hide'] 
                                        },
                                        { 
                                            trigger: 'axis-label:mouseleave', 
                                            action: ['cursor:default', 'axis-label-highlight:reset', 'element-highlight:reset', 'tooltip:hide'] 
                                        },
                                    ]
                                }
                            },
                        ]}

                        tooltip={{
                            title: 'risk_group',
                            customContent: (title: string) => {
                                const argData = apiData.filter((item) => {
                                    const tempTitle = title.replace("G0", "")
                                    return item.risk_group == parseInt(tempTitle).toString()
                                })
                                return CustomTooltip(title, argData)
                            }
                        }}

                        animation={!opened}

                        className={`pb-6 pr-3`}
                    />

                    <HospitalCount />

                    <Button
                        className={`absolute -right-1 bottom-1 mr-2 rounded-3xl bg-[#6395f9] hover:bg-[#4681f7]`} 
                        variant={`filled`}
                        size="xs"
                        onClick={openData}
                        style={{ height: "22px" }}
                    >
                        Detail
                    </Button>

                </div>
            </CardChart>

            <Modal
                opened={opened}
                onClose={close}
                size={`50vw`}
                radius={`md`}
                centered
                title={modalData?.title}
            >
                <div
                    className={`flex flex-center relative overflow-hidden`}
                    style={{ width: "100%", height: "60vh" }}
                >
                    <CustomColumn
                        data={modalData?.data ?? []}
                        xField="risk_code"
                        yField="value"

                        className={`absolute px-2 wh-full`}

                        tooltip={{
                            title: 'risk_code',
                            customContent: (title) => {
                                const argData = apiData.filter((item) => item.risk_code == title || item.risk_group == modalData?.key)
                                if (argData) return CustomTooltip(title, argData)
                            }
                        }}
                    />
                </div>
            </Modal>

            <ModalDetailStandardStackedColumn
                data={hospitalModalData}
                stateModal={{
                    opened: openedData,
                    open: openData,
                    close: closeData
                }}
            />
        </>
    )
}