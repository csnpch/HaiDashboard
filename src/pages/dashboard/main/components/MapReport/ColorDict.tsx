import { MapContext } from "@/data/context/map"
import { useContext } from "react"

interface colorDict {
    color: string,
    range: string,
}

interface propsInterface {
    label?: string,
    colorDict: colorDict[]
}


export default function ColorDict(props: propsInterface) {


    const { ...map_context } = useContext(MapContext)

    return (
        <>
            <div 
                className={`flex flex-col gap-y-1 z-10 bg-white p-2 rounded-lg`}
                style={{
                    position: map_context.contentSideDataProvince.isOpen 
                        ? 'fixed' : 'absolute',
                    right: map_context.contentSideDataProvince.isOpen 
                        ? '44%' : '14px',
                    bottom: map_context.contentSideDataProvince.isOpen 
                        ? '34%' : '10px',
                    zIndex: 50,
                    border: map_context.contentSideDataProvince.isOpen
                        ? '2px solid #00000010' : 'none',
                }}
            >

                <p className={`text-xs text-center`}>
                    { props.label || 'ช่วงค่าของสี' }
                </p>

                {
                    props.colorDict.map((item, index) => {
                        return (
                            <div 
                                key={index} 
                                className={`flex items-center gap-x-2 text-xs`}
                            >
                                <div style={{ 
                                    borderRadius: '100%', 
                                    backgroundColor: item.color, 
                                    width: "8px", 
                                    height: "8px" 
                                }}></div>
                                <div>
                                    {item.range}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </>
    )


}

