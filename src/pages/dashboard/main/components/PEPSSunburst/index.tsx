import CardChart from "@/components/CardChart";
import { FilterContext } from "@/data/context/filter";
import { DataTransferObject } from "@/interfaces/api/respose";
import { IPEPSHospitalModel, IPEPSModel } from "@/interfaces/api/dashboard";
import { XverServices } from "@/services/api/hospital/dashboard";
import { Badge, Button } from "@mantine/core";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useContext, useEffect, useState } from "react";
import ModalDetailPEPSSunburst from "./ModalDetail";
import { useDisclosure } from "@mantine/hooks";
import { isBrightColor } from "@/utils/helpers/functions";

interface ApiDataTransferObject extends DataTransferObject {
    data: IPEPSModel
}

interface ApiModalDataTransferObject extends DataTransferObject {
    data: IPEPSHospitalModel[]
}

export default function PEPSSunburst() {
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
    });

    const { ...filter_context } = useContext(FilterContext)

    const colors = ["#f88980", "#f8cbac", "#fee79b", "#c5e0b5", "#00af50"]

    const [data, setData] = useState<IPEPSModel>({
        title: "root",
        children: [],
    });
    const [modalData, setModalData] = useState<IPEPSHospitalModel[]>([])
    const [opened, { open, close }] = useDisclosure();

    const childrenLoop = (data: IPEPSModel) => {
        let temp = 0
        if (typeof data.children != "undefined") {
            temp = data.children.map((e) => {
                if (e.children) {
                    return childrenLoop(e)
                } else {
                    return e.value || 0
                }
            }).reduce((a: any, b: any) => a + b, 0)
            temp = temp != 0 ? temp / data.children.length : 0
            temp = parseFloat(temp.toFixed(2))
        } else {
            temp = parseFloat((data.value || 0).toFixed(2))
        }
        return temp;
    }

    const checkEmptyData = (data: IPEPSModel) => {
        const sum = childrenLoop(data)
        return (!sum || sum == 0) ? true : false
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
                โรงพยาบาลที่มีข้อมูล: { modalData.length }
            </Badge>
        )
    }

    const GetPEPS = () => {
        try {
            if (data.children) {
                const tempPE = data.children.find((e) => e.title == "PE")
                const tempPS = data.children.find((e) => e.title == "PS")
    
                if (typeof tempPE != "undefined" && typeof tempPS != "undefined") {
                    const result = parseFloat(((childrenLoop(tempPE) + childrenLoop(tempPS)) / 2).toFixed(2))
                    const color = colors[Math.floor(result) - 1]
                    return (
                        <Badge
                            className={`text-[0.9rem] border-2 bg-white p-2 rounded-lg shadow-md text-inherit`}
                            size={`lg`}
                            style={{ 
                                backgroundColor: color,
                                color: isBrightColor(color, 150) ? '#000' : '#fff'
                            }}
                        >
                            { result.toFixed(2) }
                        </Badge>
                    )
                } else {
                    return <span>0</span>
                }
            }
        } catch (err) {
            return <span>0?</span>
        }
        return <span>0?</span>
    }

    const fetchData = () => {
        XverServices.PEPS(
            filter_context.regional_health.id, 
            filter_context.map.provinceSelected.state, 
            filter_context.map.hospitalCode.state,
            filter_context.year.value
        ).then((res: ApiDataTransferObject) => {
            // console.log('res:PEPS', res.data)
            if (res.status_code == 200) {
                setData(res.data)
                setLoading(prev => ({
                    ...prev,
                    state: false,
                }))
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

    const fetchModalData = async () => {
        try {
            const res: ApiModalDataTransferObject = await XverServices.PEPSHospital(
                filter_context.regional_health.id, 
                filter_context.map.provinceSelected.state, 
                filter_context.map.hospitalCode.state
            )
            // console.log('res:PEPSHospital', res.data)
            if (res.status_code == 200) {
                if (res.data != null) {
                    setModalData(res.data)
                } else {
                    setModalData([])
                    
                }
            } else {
                throw res;
            }
        } catch (err) {
            console.log(err);
        }
    }

    const triggerFetch = () => {
        setLoading({ ...loading, state: true })
        fetchData()
    }


    useEffect(() => {
        fetchData();
        fetchModalData();
    }, [
        filter_context.regional_health.id,
        filter_context.map.provinceSelected.state,
        filter_context.map.hospitalCode.state,
        filter_context.year.value,
        filter_context.indicator.value
    ])

    return (
        <>
            <CardChart 
                title={`Patient Satisfaction & Patient Experience`} 
                className={`relative wh-full"`}
                stateLoading={loading.state}
                stateError={loading.errorState}
                stateEmptyData={checkEmptyData(data)}
                triggerFetch={triggerFetch}
            >
                <div className={`z-20 absolute w-full pt-2 px-3 flex-none`} style={{ height: "92%" }}>

                    <ResponsiveSunburst
                        data={data}
                        id={`title`}
                        key={`title`}
                        value={`value`}
                        inheritColorFromParent={false}
                        valueFormat={`>-`}
                        childColor={{
                            modifiers: [
                                ["darker", 0],
                                ["brighter", 0],
                            ],
                            from: "color"
                        }}
                        colors={(e: {
                            data: IPEPSModel
                        }) => {
                            if (e.data.value) return colors[Math.floor(e.data.value) - 1]
                            return colors[Math.floor(childrenLoop(e.data)) - 1]
                        }}
                        colorBy={`id`}
                        // enableArcLabels
                        arcLabel={(e: {
                            data: IPEPSModel
                        }) => {
                            return `${childrenLoop(e.data).toFixed(0)}`
                        }}
                        tooltip={(e: {
                            id: string | number,
                            data: IPEPSModel
                        }) => {
                            const result = childrenLoop(e.data)
                            const color = colors[Math.floor(result) - 1]
                            return (
                                <Badge
                                    className={`bg-white p-3 rounded-md shadow-md`}
                                    size={`xl`}
                                    style={{ backgroundColor: color, color: `inherit` }}
                                >
                                    {`${e.id} : ${result.toFixed(2)}`}
                                </Badge>
                            )
                        }}
                        layers={["arcs", "arcLabels"]}
                        transitionMode={`pushIn`}
                        motionConfig={`gentle`}
                    />

                </div>

                <div className="z-10 wh-full absolute top-0 left-0 flex-center">

                    <p className={`font-medium tracking-wide text-lg -mt-2 text-center`}>
                        <span className={`opacity-60`}>PS / PE</span>
                        <br />
                        <GetPEPS />
                    </p>

                </div>

                <HospitalCount />

                <Button
                    className={`z-20 absolute -right-1 bottom-1 mr-2 rounded-3xl bg-[#6395f9] hover:bg-[#4681f7]`} 
                    variant={`filled`}
                    size="xs"
                    onClick={open}
                    style={{ height: "22px" }}
                >
                    Detail
                </Button>

            </CardChart>

            <ModalDetailPEPSSunburst 
                data={modalData} 
                stateModal={{
                    opened: opened,
                    open: open,
                    close: close,
                }} 
            />
        </>
    )
}