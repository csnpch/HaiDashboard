import { Helmet } from 'react-helmet'
import Main from '@/components/layout/Main'

export default function HospitalDashboardPage() {
    
    return (
        <>
            <Helmet>
                <title>Hospital | Dashbaord</title>
            </Helmet>

            <Main className={`w-full flex-center flex-col gap-4 -mt-40`}>

                Hospital Dashboard Page

            </Main>
        </>
    )
}

