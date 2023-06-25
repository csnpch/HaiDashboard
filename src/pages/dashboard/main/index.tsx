// build-in
// external
import { Helmet } from 'react-helmet'
import { useMediaQuery } from 'react-responsive'
// internal
import Main from '@/components/layout/Main'
import { _class } from '@/utils/helpers/functions'
// in-directory
import RadarChart from './components/Radar'
import MapReport from './components/MapReport'
import IndicatorTreemap from './components/IndicatorTree'
import StandardStackedColumn from './components/StandardStacked'
import AccScoreRadar from './components/AccScoreRadar'
import PEPSSunburst from './components/PEPSSunburst'
import ErrorBoundary from '@/components/ErrorBoundary'


export default function MainDashboardPage() {

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })


    return (
        <>

            <Helmet>
                <title>Dashbaord | HAI</title>
            </Helmet>

            
            <Main className={_class(`
                w-full grid h-10/12
                gap-1 pt-2
                grid-rows-3
                2xl:grid-cols-8
                grid-cols-4
                overflow-hidden
            `)}>


                {/* Map overview LEFT TOP */}
                <div className={_class(`
                    items-center 
                    col-span-2 2xl:col-span-4
                    row-span-2
                `)}>
                    <ErrorBoundary>
                        <MapReport />
                    </ErrorBoundary>
                </div>


                {/* RIGHT TOP */}
                <div className={_class(`
                    col-span-2 2xl:col-span-4
                    row-span-2
                `)}>
                    <ErrorBoundary>
                        <RadarChart
                            style={{
                                height: isBigScreen ? '82%' : '86%',
                            }}
                            padding={[
                                68, 
                                0, 
                                isBigScreen ? 30 : 28, 
                                0
                            ]}
                        />
                    </ErrorBoundary>
                </div>


                {/* BOTTOM-1 */}
                <div
                    className={_class(`
                        items-center
                        row-start-3
                        col-start-1
                        2xl:col-span-2
                    `)}
                >
                    <ErrorBoundary>
                        <AccScoreRadar />
                    </ErrorBoundary>
                </div>


                {/* BOTTOM-2 */}
                <div
                    className={_class(`
                        items-center
                        row-start-3
                        2xl:col-start-3
                        2xl:col-span-2
                    `)}
                >
                    <ErrorBoundary>
                        <PEPSSunburst />
                    </ErrorBoundary>
                </div>


                {/* BOTTOM-3 */}
                <div className={_class(`
                    items-center 
                    2xl:col-span-2
                `)}>
                    <ErrorBoundary>
                        <StandardStackedColumn />
                    </ErrorBoundary>
                </div>


                {/* BOTTOM-4 */}
                <div className={_class(`
                    items-center 
                    2xl:col-span-2
                `)}>
                    <ErrorBoundary>
                        <IndicatorTreemap />
                    </ErrorBoundary>
                </div>


            </Main>

        </>
    )
}