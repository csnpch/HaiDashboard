import { useState } from 'react'

import { Button } from '@mantine/core';
import { 
    FiSearch 
} from 'react-icons/fi';
import { _class } from '@/utils/helpers/functions';


interface propsInterface {
    onSearch: (value: string) => void,
    loading?: boolean
}


export default function Search(props: propsInterface) {

    const [word, setWord] = useState<string>('11540')

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        setWord(event.currentTarget.value)
    }

    const handleSearch = () => {
        props.onSearch(word)
    }

    
    return (
        <>

            <div className={`w-full h-12 flex justify-between items-center gap-x-4`}>
                
                <div className={_class(`
                    wh-full bg-white shadow-md
                    flex items-center rounded-xl overflow-hidden
                `)}>

                    <div className='text-2xl text-[#9D9D9D] px-4 mt-2'>
                        <FiSearch />
                    </div>
                    <input
                        value={word}
                        onChange={handleChange}
                        type='number'
                        name='search'
                        className={`wh-full text-lg font-medium text-[#484848] tracking-wider`}
                        placeholder='โปรดกรอก HCODE'
                    />

                </div>
                <Button
                    loading={props.loading}
                    onClick={handleSearch} 
                    className={_class(`
                        h-full w-40 font_kanit tracking-widest font-normal 
                        text-lg shadow-lg rounded-lg
                    `)}
                >
                    ค้นหา
                </Button>
            </div>

        </>
    )
}