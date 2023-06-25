import img2 from '@/assets/img/EasterEgg/B.jpg' 
import { _class } from '@/utils/helpers/functions'
import { GrClose }  from 'react-icons/gr'


interface propsInterface {
    stateOpen: {
        isOpen: boolean,
        setOpen: (state: boolean) => void 
    }
}


export default function EasterEgg(props: propsInterface) {

    return (
        <>

            <div 
                className={`absolute right-20 top-20 cursor-pointer`}
                style={{
                    zIndex: 2000,
                }}
                onClick={() => props.stateOpen.setOpen(false)}
            >
                <GrClose 
                    className={`text-4xl`}
                />
            </div>


            <div 
                className={_class(`
                    absolute flex-center wh-full top-0 left-0
                    bg-white/80
                `)}
                style={{
                    zIndex: 1000,
                }}
            >

                <div className={`w-full h-5/6 flex-center flex-col relative justify-between`}>


                    {/* center */}
                    <div className={`flex-center flex-col h-full w-full`}>
                        <p className={`text-4xl mb-8 text-purple-700 tracking-wider text-center`}>
                            <p>`Croissant Team`</p>
                            <p className={`text-sm mt-2 text-black`}>
                                IT-FITM KMUTNB @PRACHINBURI
                            </p>
                        </p>

                        <div className={`flex-center`} style={{
                            height: '80%',
                            width: '80%',
                            overflow: 'hidden',
                        }}>
                            <img src={img2} alt="" className='shadow-xl'
                                style={{
                                    objectFit: 'cover',
                                    height: '100%',
                                    borderRadius: '50%',
                                }}
                            />
                        </div> 
                    </div>


                </div>

            </div>

        </>
    )
}