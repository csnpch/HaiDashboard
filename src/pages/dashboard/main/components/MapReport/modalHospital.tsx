import { FilterContext } from "@/data/context/filter";
import { Overlay } from "@mantine/core";
import { Descriptions } from "antd";
import { useContext, useEffect, useState } from "react";
import { FaHospital } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { XverServices } from "@/services/api/hospital/dashboard";
import { IInfoHospital } from "@/interfaces/api/dashboard";
import { _class, getRegionalHealthNameFromId } from "@/utils/helpers/functions";

interface propsInterface {
    stateModal: {
        opened: boolean,
        open?: () => void,
        close: () => void,
    },
}

export default function ModalHospital(props: propsInterface) {


    const { ...filter_context } = useContext(FilterContext)
    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
        emptyState: false,
    })
    const [dataHospital, setDataHospital] = useState<IInfoHospital>({} as IInfoHospital)
    const colorLable = '#1e40af'


    const fetchInfoHospital = async () => {
        
        try {
            const res = await XverServices.HospitalInfo(filter_context.map.hospitalCode.state)
            setDataHospital(res.data)
            setLoading(prev => ({
                ...prev,
                state: false,
                errorState: false
            }))
        } catch (err) {
            setLoading(prev => ({
                ...prev,
                state: false,
                errorState: true
            }))
        }
    
    }


    const closeModal = () => {
        filter_context.map.hospitalCode.setState('')
        props.stateModal.close()
    }

    useEffect(() => {
        filter_context.map.hospitalCode.setState(filter_context.map.hospitalCode.state);
    }, [props.stateModal.open])

    
    useEffect(() => {
        fetchInfoHospital()
        setLoading(prev => ({
            ...prev,
            state: true,
            errorState: false
        }))
    }, [filter_context.map.hospitalCode.state])


    useEffect(() => {
        if (filter_context.onSearchHospital.value === true){
            // @ts-ignore
            props.stateModal.open()
            filter_context.onSearchHospital.setValue(false)
        }
    }, [
        filter_context.onSearchHospital.value
    ])



    return (
        <>
        
            {
                props.stateModal.opened
                &&
                <Overlay
                    blur={1} 
                    className={`absolute top-0 left-0 wh-full bg-black/20 flex-center`}
                    style={{
                        zIndex: 100,
                    }}
                >

                    
                    <div className={_class(`
                        w-10/12 h-5/6 mx-auto bg-white
                        rounded-md shadow-md pt-6 px-6
                    `)}>

                        
                        {
                            loading.state &&
                            <div className={`text-lg`}>
                                loading...
                            </div>
                        }

                        {
                            loading.errorState &&
                            <div className={`text-xl text-center my-20 flex flex-col gap-y-6`}>
                                <p className={`text-red-600`}>- ไม่พบข้อมูลโรงพยาบาล -</p>
                                <p 
                                    className={`underline cursor-pointer text-[0.98rem]`}
                                    onClick={() => closeModal()}
                                >
                                    ปิดหน้าต่าง
                                </p>
                            </div>
                        }


                        {
                            (!loading.state && !loading.errorState) &&
                            <>
                            
                                <div className={`w-full flex items-center justify-between`}>
                                    <p className={`flex items-center gap-x-2`}>
                                        <FaHospital 
                                            className={`text-red-600`} 
                                            style={{
                                                marginTop: '-2.5px',
                                            }}
                                        />
                                        <span className={`text-red-600`}>
                                            { dataHospital.hospital_name }
                                        </span>
                                    </p>
                                    <div 
                                        className={`cursor-pointer text-xl`}
                                        onClick={closeModal}
                                    >
                                        <IoClose />
                                    </div>
                                </div>

                                <div className={`mt-4 h-5/6 overflow-y-auto grid-cols-4 custom_scrollbar_show`}>
                                    
                                    <Descriptions 
                                        bordered
                                        size="middle"
                                    >
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="รหัสสถานพยาบาล" span={2}>
                                            { dataHospital.hospital_code }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label="ชื่อสถานพยาบาล" span={2}
                                            labelStyle={{
                                                color: colorLable,
                                                whiteSpace: 'nowrap',
                                                width: 'auto',
                                            }}
                                        >
                                            { dataHospital.hospital_name }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="ประเภทของโรงพยาบาล" span={2}>
                                            { `โรงพยาบาลชุมชน` }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="ระดับการบริการ" span={2}>
                                            { dataHospital.organization_level }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="จำนวนเตียง (เตียงล่าสุด)" span={2}>
                                            { `- ไม่มีคีย์ -` }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="เขตสุขภาพ" span={2}>
                                            { getRegionalHealthNameFromId(filter_context.regional_health.id) }
                                            {/* <Badge status="processing" text="Running" /> */}
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="จังหวัด" span={2}
                                        >
                                            { dataHospital.province_name || '- ไม่มีข้อมูล -' }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="อำเภอ" span={2}>
                                            { '- ไม่มีคีย์ -' }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="วิสัยทัศน์ รพ." span={4}>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: dataHospital?.expertise || '- ไม่มีข้อมูล -'
                                                }}
                                            />
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="Core competentcy" span={2}>
                                            { `- ไม่มีคีย์ -` }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="Strategic Objectives" span={2}>
                                            { `- ไม่มีคีย์ -` }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="จำนวนรวมผู้ป่วย`ใน`ทั้งปี" span={2}>
                                            { dataHospital.in_patient || '- ไม่มีข้อมูล -' }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="จำนวนวันนอนผู้ป่วย`นอก`ทั้งปี" span={2}>
                                            { dataHospital.out_patient || '- ไม่มีข้อมูล -' }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}
                                            label="10 อันดับการวินิจฉัยโรคผู้ป่วยนอก" span={4}>
                                            {
                                                [1,2,3,4,5,6,7,8,9,10].map((_item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`tracking-wider`}
                                                        >
                                                            {index + 1}. อะไรสักอย่าง
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            labelStyle={{
                                                color: colorLable
                                            }}

                                            label="10 อันดับการวินิจฉัยโรคผู้ป่วยใน" span={4}
                                            style={{
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            {
                                                [1,2,3,4,5,6,7,8,9,10].map((_item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`tracking-wider`}
                                                        >
                                                            {index + 1}. อะไรสักอย่าง
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Descriptions.Item>
                                    
                                    </Descriptions>
                                    
                                </div>

                            </>
                        }


                    </div>
                    

                </Overlay>
            }
        
        </>
    )


}