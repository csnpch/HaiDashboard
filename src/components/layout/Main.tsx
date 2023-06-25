// build-in
import { useEffect, useState } from 'react'
// external
// internal
import { itemOfIndicator, regionCode, viewByType } from '@/interfaces/type/map';
import Navbar from './../navbar';
import SplashScreen from './../SplashScreen';
import { elementPropsInterface } from '@/interfaces/share/elementProps';
import ProtectRoutes from '@/router/ProtectRoutes';
import { FilterContext } from '@/data/context/filter';
import { _class } from '@/utils/helpers/functions';


interface propsInterface {
    className?: string,
    gapNavbar?: string,
    splashScreen?: boolean
}


export default function Main({
    children,
    className = '',
    gapNavbar = '',
    splashScreen = false
}: elementPropsInterface & propsInterface) {

    const [indicator, setIndicator] = useState<itemOfIndicator>("CMI");
    const [codeRegionalFilterData, setCodeRegionalFilterData] = useState<regionCode>(0)
    const [idRegionalHealthFilterData, setIdRegionalHealthFilterData] = useState<regionCode>(0)
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [viewBy, setViewBy] = useState<viewByType>('regional_health')
    const [labelRegionalHealthFilterData, setLabelRegionalHealthFilterData] = useState<string>('');
    const [provinceSelected, setProvinceSelected] = useState("")
    const [hospitalCode, setHospitalCode] = useState("")
    const [onSearchHospital, setOnSearchHospital] = useState<boolean>(false)


    const gridLayoutRows = {
        display: 'grid',
        gridTemplateRows: 'min-content 1fr'
    }


    useEffect(() => {
        console.log('global:HCODE = ', hospitalCode)
    }, [hospitalCode])
    

    return (
        <>
            { splashScreen && <SplashScreen /> }

            <ProtectRoutes />

            <FilterContext.Provider value={{
                filterUsing: 'regional_health',
                onSearchHospital: {
                    value: onSearchHospital,
                    setValue: setOnSearchHospital,
                },
                regional: {
                    code: codeRegionalFilterData,
                    setCode: setCodeRegionalFilterData,
                },
                regional_health: {
                    id: idRegionalHealthFilterData,
                    setId: setIdRegionalHealthFilterData,
                    label: labelRegionalHealthFilterData,
                    setLabel: setLabelRegionalHealthFilterData,
                },
                indicator: {
                    value: indicator,
                    setValue: setIndicator,
                },
                year: {
                    value: year,
                    setValue: setYear,
                },
                map: {
                    view_by: {
                        state: viewBy,
                        setState: setViewBy
                    },
                    hospitalCode: {
                        state: hospitalCode,
                        setState: setHospitalCode,
                    },
                    provinceSelected: {
                        state: provinceSelected,
                        setState: setProvinceSelected,
                    }
                }
            }}>


                <div 
                    className={`container_main`}
                >

                    {/* <Sidebar
                        logoSrc={Logo}
                        className={`
                            pt-1 2xl:pt-3.5 absolute bg-base
                            ${true ? '-left-16' : 'left-0'}
                        `}
                    /> */}

                    <div 
                        className={_class(`
                            w-full p-2 h-screen
                            ${gapNavbar}
                        `)} 
                        style={gridLayoutRows}
                    >

                        <Navbar className={`h-10 2xl:h-11`} />

                        <div className={_class(`
                            ${className || ''}
                        `)}>
                            { children }
                        </div>

                    </div>
                    

                </div>
            
            
            </FilterContext.Provider>
        </>
    )


}