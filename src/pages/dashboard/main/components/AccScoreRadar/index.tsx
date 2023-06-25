import CardChart from "@/components/CardChart";
import { FilterContext } from "@/data/context/filter";
import { DataTransferObject } from "@/interfaces/api/respose";
import { IAccScoreRadarModel } from "@/interfaces/api/dashboard";
import { XverServices } from "@/services/api/hospital/dashboard";
import { Radar, RadarConfig } from "@ant-design/charts";
import { Badge, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import ModalDetailAccScoreRadar from "./ModalDetail";
import ModalDetailNextAccScoreRadar from "./ModalDetailNext";

interface ApiDataTransferObject extends DataTransferObject {
    data: IAccScoreRadarModel;
}

export default function AccScoreRadar() {
    const { ...filter_context } = useContext(FilterContext)
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
    })
    const [apiData, setApiData] = useState<IAccScoreRadarModel>({
        count: 0,
        iv_average: 0,
        average: 0,
        data: []
    })
    const [modalData, setModalData] = useState<string[]>([])
    const [opened, { open, close }] = useDisclosure()
    const [openedModalRadar, { open: openModalRadar, close: closeModalRadar }] = useDisclosure()
    const [openedModalRadarNext, { open: openModalRadarNext, close: closeModalRadarNext }] = useDisclosure()

    useEffect(() => {
        fetchData()
    }, [
        filter_context.regional_health.id, 
        filter_context.map.provinceSelected.state,  
        filter_context.map.hospitalCode.state,
        filter_context.year.value,
        filter_context.indicator.value
    ])

    const fetchData = async () => {
        let province: string = ""
        if (filter_context.map.provinceSelected.state != "") province = filter_context.map.provinceSelected.state
        try {
            let res: ApiDataTransferObject = await XverServices.AccScoreRadar(
                filter_context.regional_health.id, 
                province, 
                filter_context.map.hospitalCode.state,
                filter_context.year.value
            )

            if (res.status_code === 200 || res.error === null) {
                const resData = res.data
                if (resData) {
                    const data: IAccScoreRadarModel["data"] = resData.data.map((item) => {
                        return {
                            key: formatKey(item.key),
                            value: parseFloat(item.value.toFixed(2))
                        }
                    })
                    setApiData({ ...resData, data })
                    setLoading({ ...loading, state: false })
                } else {
                    throw res.error
                }
            }
        } catch (error) {
            setLoading({ ...loading, state: false, errorState: true })
        }
    }

    const formatKey = (key: string) => {
        const split = key.split("_").map((item) => item.toUpperCase())
        const text = `${split[0]}-${split[1]} ${split[2]}`
        setModalData(modalData => [...modalData, text])
        return text
    }

    const CustomRadar = (props: RadarConfig) => {
        return <Radar
            meta={{ value: {
                range: [0, 1],
                min: 0,
                max: 5,
            } }}
            legend={false}
            autoFit
            animation={false}
            {...props}
        />
    }

    const HospitalCount = () => {
        return (
            <Badge
                variant={`outline`}
                color={`gray`}
                size={`sm`}
                className={`absolute bottom-1 left-1 text-gray-700`}
                style={{ height: "22px" }}
            >
                โรงพยาบาลที่มีข้อมูล: { apiData.count }
            </Badge>
        )
    }

    const ScoreModalTitle = () => {
        return (
            <div className={`flex-col w-full`}>
                <span>Score for accreditation</span>
                <Badge 
                    variant={`filled`} 
                    color={`blue`} 
                    size={`lg`} 
                    className={`absolute top-4 right-10`}
                >
                    { apiData.average.toFixed(2) }
                </Badge>
            </div>
        )
    }

    const triggerFetch = () => {
        setLoading({ ...loading, state: true })
        fetchData()
    }


    useEffect(() => {
        // console.log(apiData)
    }, [apiData])



    return (
        <>

            <ModalDetailAccScoreRadar 
                stateModal={{
                    opened: openedModalRadar,
                    open: openModalRadar,
                    close: closeModalRadar,
                }}
                data={[...new Set(modalData)].sort((a, b) => a.localeCompare(b))}
            />

            <ModalDetailNextAccScoreRadar
                stateModal={{
                    opened: openedModalRadarNext,
                    open: openModalRadarNext,
                    close: () => {
                        closeModalRadarNext()
                        open()
                    }
                }}
                data={[...new Set(modalData)].sort((a, b) => a.localeCompare(b))}
            />

            <CardChart
                title="Score for accreditation"
                topRight={
                    apiData.count > 0 ? 
                        <Badge
                            variant={`filled`}
                            color={`blue`}
                            size={`lg`}
                            className={`relative -mt-2.5 px-2.5 h-5 w-14`}
                        >
                            { apiData.iv_average.toFixed(2) }
                        </Badge>
                    : null
                }
                stateLoading={loading.state}
                stateError={loading.errorState}
                stateEmptyData={apiData.count == 0}
                triggerFetch={triggerFetch}
            >
                <div className={`wh-full p-2 absolute`}>
                    <CustomRadar
                        data={apiData.data.filter((item) => item.key.includes("IV"))}
                        xField={"key"}
                        yField={"value"}
                        animation={!opened}
                        
                        onEvent={(e) => {
                            e.on("plot:click", open)
                            e.on("plot:mouseenter", () => e.chart.canvas.setCursor("pointer"))
                            e.on("plot:mouseleave", () => e.chart.canvas.setCursor("default"))
                        }}
                    />
                </div>

                <HospitalCount />
                
                <Button
                    className={`absolute -right-1 bottom-1 mr-2 rounded-3xl bg-[#6395f9] hover:bg-[#4681f7]`} 
                    variant={`filled`}
                    size="xs"
                    onClick={() => openModalRadar()}
                    style={{ height: "22px" }}
                >
                    Detail
                </Button>

            </CardChart>

            <Modal 
                opened={opened} 
                onClose={close} 
                size={`50vw`} 
                title={<ScoreModalTitle />} 
                centered
            >
                <div 
                    className={`wh-full relative`} 
                    style={{ height: "60vh" }}
                >
                    <CustomRadar 
                        className={`absolute wh-full -pt-4 top-0`} 
                        data={apiData.data} 
                        xField={"key"} 
                        yField={"value"} 
                    />

                    <HospitalCount />
                    <Button
                        className={`absolute -right-1 bottom-1 mr-2 rounded-3xl bg-[#6395f9] hover:bg-[#4681f7]`} 
                        variant={`filled`}
                        size="xs"
                        onClick={() => {
                            openModalRadarNext()
                            close()
                        }}
                        style={{ height: "22px" }}
                    >
                        Detail
                    </Button>
                </div>
            </Modal>
        </>
    )
}