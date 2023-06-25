import { useState, useEffect } from 'react'

export default function SplashScreen() {
    const [statusSplash, setStatusSplash] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setStatusSplash(false)
        }, 400)
    }, [])

    return (
        <>
            {
                statusSplash 
                ? <div className={`container-splash-screen bg-white`}></div>
                : <div className={'absolute'}></div>
            }
        </>
    )
}
