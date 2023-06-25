import { _class } from '@/utils/helpers/functions'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

interface propsInterface {
    className?: string
    placeholder?: string
    value?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    icon?: React.ReactNode
    maxLength?: number,
    helperText?: string
    error?: boolean,
    classes?: {
        helperText?: string
        error?: string
    }
}


export default function TextInput(props: propsInterface) {

    const [showPassword, setShowPassword] = useState(false)

    const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.maxLength)
            if (event.target.value.length > props.maxLength) return        
    
        props.onChange && props.onChange(event)
    }

    return (
        <>

            <Helmet>
                <title>Authentication</title>
            </Helmet>

            <div className='relative w-full'>
                <input 
                    name='base'
                    type={showPassword ? 'text' : (props.type || 'text')}
                    placeholder={props.placeholder}
                    className={_class(`
                        w-full border-2 text-base px-4 py-2 rounded-md
                        bg-[#F9FAFB] tracking-wide
                        ${props.className}  
                        ${
                            props.error 
                            ? 'border-red-600 focus:border-red-700' 
                            : 'border-black/20 focus:border-blue-700'
                        }  
                    `)}
                    value={props.value || ''}
                    onChange={handleChangeValue}
                    maxLength={props.maxLength}
                />
                {
                    props.type === 'password' &&
                    <div 
                        className={`z-20 absolute top-[1.1rem] right-4 cursor-pointer text-lg`}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {
                            showPassword 
                            ? <AiOutlineEyeInvisible />
                            : <AiOutlineEye />
                        }
                    </div>
                }
                { 
                    props.helperText &&
                    <p className={_class(`
                        mt-1 text-sm text-red-600 tracking-wide 
                        ${props.classes?.helperText}
                    `)}>
                        { props.helperText }
                    </p>
                }
            </div>
        </>
    )

}