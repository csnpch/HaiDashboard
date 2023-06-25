import { Button } from "@mantine/core"
import { Modal } from "antd"
import { useState } from "react"
import { FiSearch } from "react-icons/fi"


interface propsInterface {
    stateModal: {
        isModalOpen: boolean
        setIsModalOpen: (value: boolean) => void
    },
    onSearch: (value: string) => void
    onLoadingSearch?: boolean
    notFound?: boolean
}



export default function ModalSearchHospital(props: propsInterface) {
    
    const [word, setWord] = useState<string>('')


    const onSearch = () => {
        props.onSearch(word)
    }


    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWord(e.target.value)
    }


    const handleCancel = () => {
        props.stateModal.setIsModalOpen(false)
    }
    
    
    return (
        <>
        
            <Modal 
                open={props.stateModal.isModalOpen}
                className={`pt-4`}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                closeIcon={<></>}
                onCancel={handleCancel}
            >

                <p className={`mb-1 ml-0.5 tracking-wide text-black/60`}>
                    ค้นหาสถานพยาบาลที่ต้องการดูข้อมูล
                </p>
            
                <div className={`mt-2 w-full flex justify-between items-center gap-x-2`}>
                    <div className={`wh-full bg-white shadow-md rounded-xl border-2 flex items-center`}>
                        <div className='text-2xl text-[#9D9D9D] px-4 mt-2'>
                            <FiSearch />
                        </div>
                        <input 
                            type='text'
                            name='search'
                            className={`wh-full text-base text-[#757575] tracking-wider`}
                            value={word}
                            onChange={handleChangeSearch}
                            placeholder='HCODE'
                        />
                    </div>
                    <Button 
                        className={`h-10 w-30 font_prompt tracking-widest font-normal text-base shadow-lg`}
                        onClick={onSearch}
                        loading={props.onLoadingSearch}
                    >
                        ค้นหา
                    </Button>
                </div>

                {
                    props.notFound &&
                    <p className={`text-red-700/80 text-lg mt-6 text-center`}>
                        - ไม่พบข้อมูล -
                    </p>
                }
            
            
            </Modal>
        
        </>
    )
}