import {useContext, useEffect, useState} from 'react';
import { Radar } from '@ant-design/plots';
import CardChart from '@/components/CardChart';

import { createStyles, Box, Text, Group, SimpleGrid, rem } from '@mantine/core';
import { useMediaQuery } from 'react-responsive';
import { moneyFormat } from '@/utils/helpers/functions';
import {XverServices} from "@/services/api/hospital/dashboard";
import {FilterContext} from "@/data/context/filter.ts";
import { IPopulation, IRadarModel} from "@/interfaces/api/dashboard";
import ProvinceData from '@/data/json/mock_province.json';
import { Skeleton, Switch, Tooltip } from 'antd';
import { BsInfoCircle } from 'react-icons/bs';
import ModalDetailRadarChart from './ModalDetail';
import { useDisclosure } from '@mantine/hooks';
import EasterEgg from '../EasterEggs';
import { regional_health } from '@/data/dict/regional_health';

interface propsInterface {
    style?: React.CSSProperties,
    padding?: number[],
}
type switchToggleRadar = 'all'|'hospital'


interface loadingStaticInterface {
    peopleOfMed: {
        state: boolean,
        errorState: boolean,
    },
    population: {
        state: boolean,
        errorState: boolean,
    },
}


export default function RadarChart(props: propsInterface) {

    const [loading, setLoading] = useState({
        state: true,
        errorState: false,
    });

    const { ...filter_context } = useContext(FilterContext)

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const [dataRadarHospital, setDataRadarHospital] = useState<IRadarModel[]>([]);
    const [dataRadarZone, setDataRadarZone] = useState<IRadarModel[]>([]);
    const [dataRadarProvince, setDataRadarProvince] = useState<IRadarModel[]>([]);
    const [dataRadarAll, setDataRadarAll] = useState<IRadarModel[]>([]);
    const [population, setPopulation] = useState<IPopulation[]>([]);
    const [showFullData, setShowFullData] = useState(true);
    const [switchToggleRadar, setSwitchToggleRadar] = useState<switchToggleRadar>('all')

    const [loadingStatic, setLoadingStatic] = useState<loadingStaticInterface>({
        peopleOfMed: {
            state: true,
            errorState: false,
        },
        population: {
            state: true,
            errorState: false,
        },
    })


    const fetchPersonnelPopulation = () => {
        setLoadingStatic(prev => ({
            ...prev, 
            peopleOfMed: {
                ...prev.peopleOfMed,
                state: true,
                errorState: false,
            }
        }))
        XverServices.Personnel(
            filter_context.regional_health.id, 
            filter_context.map.provinceSelected.state, 
            filter_context.map.hospitalCode.state,
        ).then(res => {
            if (res.status_code == 200) {
                _setDataStatistics(prevState => ({ ...prevState, nurse: { ...prevState.nurse, count: res.data.nurses}, 
                    doctor: {...prevState.doctor, count: res.data.doctors} , people: {...prevState.people, count: search_population()}}))
                setLoadingStatic(prev => ({
                    ...prev, 
                    peopleOfMed: {
                        ...prev.peopleOfMed,
                        state: false,
                    }
                }))  
            } else {
                throw res;
            }
        }).catch((err) => {
            console.log(err);
            setLoadingStatic(prev => ({
                ...prev, 
                peopleOfMed: {
                    errorState: true,
                    state: false,
                }
            }))  
        });
    }

    const search_population = ():number => {
        let result = 0;
        if (filter_context.map.provinceSelected.state) {
            let province_search = filter_context.map.provinceSelected.state;
            if (province_search == 'กรุงเทพฯ') province_search = 'กรุงเทพ'
            else province_search = 'จังหวัด' + province_search
            const province = population.find(item => item.lsccDesc.includes(province_search))
            if (province) result += province.lssumtotTot;
        } else if (filter_context.regional_health.id > 0) {
            const zones = ProvinceData.filter(item => item.region_health_key == filter_context.regional_health.id);
            zones.map(item2 => {
                console.log(population)
                let province_search = item2.name;
                if (province_search == 'กรุงเทพฯ') province_search = 'กรุงเทพ'
                else province_search = 'จังหวัด' + province_search
                const province = population.find(item => item.lsccDesc.includes(province_search))
                if (province) result += province.lssumtotTot;
            })
        } else {
            result = population.reduce((sum, i) => sum += i.lssumtotTot, 0);
        }
        return result;
    }
    

    const fetchPopulation = () => {
        setLoadingStatic(prev => ({
            ...prev, 
            population: {
                ...prev.population,
                state: true,
                errorState: false,
            }
        }))
        XverServices.Population().then(res => {
            if (res.status_code == 200) {
                setLoadingStatic(prev => ({
                    ...prev,
                    population: {
                        ...prev.population,
                        state: false,
                    }
                }))
                setPopulation(res.data);
            } else {
                throw res;
            }
        }).catch((err) => {
            console.log(err);
            setLoadingStatic(prev => ({
                ...prev,
                population: {
                    ...prev.population,
                    errorState: true,
                }
            }))
        });
    }

    const fetchDataRadar = () => {
        XverServices.Radar(
            filter_context.regional_health.id, 
            filter_context.map.provinceSelected.state, 
            filter_context.map.hospitalCode.state,
            filter_context.year.value
        ).then(res => {
            if (res.status_code == 200) {
                
                if (dataRadarAll.length === regional_health.all.id) {
                    setDataRadarAll(res.data)
                } 
                
                if (
                    filter_context.regional_health.id !== regional_health.all.id 
                    && filter_context.map.provinceSelected.state === ''
                ) {
                    setDataRadarZone(res.data)
                }

                if (
                    filter_context.regional_health.id !== regional_health.all.id 
                    && filter_context.map.provinceSelected.state !== ''
                    && filter_context.map.hospitalCode.state === ''
                ) {
                    setDataRadarProvince(res.data)
                }

                if (filter_context.regional_health.id !== regional_health.all.id 
                    && filter_context.map.provinceSelected.state !== ''
                    && filter_context.map.hospitalCode.state !== ''
                ) {
                    setShowFullData(false)
                    setDataRadarHospital(res.data)
                    setSwitchToggleRadar('hospital')
                } else {
                    setShowFullData(true)
                    setDataRadarHospital([])
                    setSwitchToggleRadar('all')
                }

                setLoading(prev => ({
                    ...prev,
                    state: false,
                    errorState: false,
                }))
                
            } else {
                throw res;
            }

        }).catch((err) => {
            console.log(err);
            setLoading(prev => ({
                ...prev,
                errorState: true,
            }))
        });
    }

    const handleToggleSwitch = (checked: boolean) => {
        setSwitchToggleRadar(checked ? 'all' : 'hospital')
        checked ? setShowFullData(true) : setShowFullData(false)
    }
    
    
    const [dataStatistics, _setDataStatistics] = useState({
        doctor: {
            "label": "หมอ",
            "count": 0,
            "color": "#5b21b6"
        },
        nurse: {
            "label": "พยาบาล",
            "count": 0,
            "color": "#0c4a6e"
        },
        people: {
            "label": "จำนวนประชากร",
            "count": 0,
            "color": "#03141a"
        }
    })

    const get_radar_data = () => {
         
        return (showFullData || switchToggleRadar === 'all') 
            ? [...dataRadarAll, ...dataRadarZone, ...dataRadarProvince, ...dataRadarHospital]
            : dataRadarHospital
    }

    const triggerFetch = () => {
        setLoading({ ...loading, state: true })
        resetData()
        fetchPersonnelPopulation()
        fetchPopulation()
        fetchDataRadar()
    }

    const resetData = () => {
        if (filter_context.regional_health.id == 0) {
            setDataRadarZone([]);
        } 
        if (filter_context.map.provinceSelected.state == '') {
            setDataRadarProvince([]);
        }
    }
    
    
    useEffect(() => {
        fetchPopulation();
    }, []);


    useEffect(() => {
        fetchPersonnelPopulation()
    }, [
        filter_context.regional_health.id, 
        filter_context.map.provinceSelected.state, 
        population
    ])

    useEffect(() => {
        resetData()
        fetchDataRadar()
    }, [
        filter_context.regional_health.id, 
        filter_context.map.provinceSelected.state, 
        filter_context.map.hospitalCode.state,
        filter_context.year.value,
        filter_context.indicator.value
    ])


    // EasterEgg
    const [openEasterEgg, setOpenEasterEgg] = useState(false)
    const callEasterEgg = () => {
        setOpenEasterEgg(true)
    }

    return (
        <>

            {
                openEasterEgg &&
                <EasterEgg 
                    stateOpen={{
                        isOpen: openEasterEgg,
                        setOpen: setOpenEasterEgg
                    }}
                />
            }

            <CardChart
                title='Radar Diagram'
                className={`relative`}
                stateLoading={loading.state}
                stateError={loading.errorState}
                triggerFetch={triggerFetch}
                topRight={
                    filter_context.map.hospitalCode.state !== '' 
                    ? <Switch
                        checkedChildren="ทั้งหมด" 
                        unCheckedChildren="โรงพยาบาล" 
                        defaultChecked
                        style={{
                            width: 120,
                            backgroundColor: 
                                switchToggleRadar === 'all'
                                ? undefined : '#7a29ff',
                        }}
                        checked={switchToggleRadar === 'all'}
                        onClick={handleToggleSwitch}
                    />
                    : <></>
                }
            >

            
                <Tooltip 
                    title={`
                        สามารถกดที่ชื่อข้อมูลข้างบนของตัว Radar Chart 
                        เพื่อแยกดูข้อมูลตามพื้นที่ตามที่แสดงอยู่ได้
                    `}
                    color='#666'
                    placement="bottomLeft" 
                    className={`absolute right-6 z-50 ${
                        filter_context.map.hospitalCode.state === ''
                        ? '-top-6' : 'top-8'
                    }`}
                    arrow={false}
                >
                    <BsInfoCircle 
                        onClick={callEasterEgg}
                    />
                </Tooltip>

                {/* Radar body chart */}
                <div className='wh-full mt-2 2xl:mt-6'>
                    <Radar
                        style={{
                            ...props.style
                        }}
                        data={get_radar_data()}
                        xField='item'
                        yField='score'
                        seriesField='user'
                        meta={{
                            score: {
                                min: 0,
                                max: 5,
                                formatter: (e) => e.toFixed(2)
                            },
                        }}
                        xAxis={{
                            line: null,
                            tickLine: null,
                            grid: {
                                line: {
                                    style: {
                                        lineDash: null,
                                    },
                                },
                            },
                        }}
                        point={{
                            size: isBigScreen ? 3 : 2,
                        }}
                        padding={props.padding || [80, 0, 10, 0]}
                    />
                </div>


                
                {/* Medical total : People total */}
                <div 
                    className={`absolute -bottom-1 2xl:bottom-2 left-1/2 w-full`}
                    style={{
                        transform: isBigScreen ? 'translateX(-44%)' : 'translateX(-50%)'
                    }}
                >
                    <div className='wh-full flex justify-end items-end'>
                        <div>
                            { 
                                StatsSegments({
                                    loadingState: loadingStatic,
                                    dataStatic: dataStatistics
                                })
                            }
                        </div>
                    </div>
                </div>

            </CardChart>

        </>
    )
}







// Report statistics bottom right of radar chart

const useStyles = createStyles((theme) => ({
    stat: {
      borderBottom: `${rem(3)} solid`,
      paddingBottom: rem(5),
    },
    statCount: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      lineHeight: 1.3,
    },
    progressLabel: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
        fontSize: theme.fontSizes.sm,
    },
}));


interface itemOfStatsSegmentInterface {
    label: string;
    count: number;
    color: string;
}

interface DataSegmentsProps {
    doctor: itemOfStatsSegmentInterface
    nurse: itemOfStatsSegmentInterface
    people: itemOfStatsSegmentInterface
}


interface StatsSegmentsPropsInterface {
    dataStatic: DataSegmentsProps
    loadingState: loadingStaticInterface
}

function StatsSegments({
    dataStatic,
    loadingState
}: StatsSegmentsPropsInterface) {

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const [openedModalRadar, { open: openModalRadar, close: closeModalRadar }] = useDisclosure()
    const { classes } = useStyles();
  
    const doctor = dataStatic.doctor
    const nurse = dataStatic.nurse
    const people = dataStatic.people

    const [doctorPercent, setDoctorPercent] = useState(0)
    const [nursePercent, setNursePercent] = useState(0)
    const [peoplePercent, setPeoplePercent] = useState(0)


    useEffect(() => {
        if (nurse.count > 0 && people.count > 0) {
            const nursePercent = people.count / nurse.count
            const doctorPercent = people.count / doctor.count
            setDoctorPercent(parseFloat(doctorPercent.toFixed(2)))
            setNursePercent(parseFloat(nursePercent.toFixed(2)))
            setPeoplePercent(parseFloat(peoplePercent.toFixed(2)))
        }
    }, [nurse, people])

  
    return (
        <>

            <ModalDetailRadarChart 
                stateModal={{
                    opened: openedModalRadar,
                    open: openModalRadar,
                    close: closeModalRadar,
                }}
            />

        
            <div className={`2xl:pr-0 pr-2`} style={{
                transform: isBigScreen ? 'scale(0.9)' : 'scale(0.8)',
                
            }}>
                <SimpleGrid cols={isBigScreen ? 3 : 1} className='gap-x-6 gap-y-2'>
                    {/* item */}
                    {
                        !loadingState.peopleOfMed.state
                        ? <Box key={doctor.label} sx={{ borderBottomColor: doctor.color }} className={classes.stat} style={{
                            width: isBigScreen ? 160 : 120
                        }}>
                            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
                                {doctor.label}
                            </Text>
                    
                            <Group position="apart" align="flex-end" spacing={0}>
                                <Text fw={700}>{JSON.stringify(doctor.count)}</Text>
                                <Text c={doctor.color} fw={700} size="sm" className={classes.statCount}>
                                    1 : { Math.round(doctorPercent) }
                                </Text>
                            </Group>
                        </Box>
                        : <div className='flex flex-col items-center'>
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '14px'
                                }}
                            />
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '30px'
                                }}
                            />
                        </div>
                    }
                    {/* item */}
                    {
                        !loadingState.peopleOfMed.state
                        ? <Box key={nurse.label} sx={{ borderBottomColor: nurse.color }} className={classes.stat} style={{
                            width: isBigScreen ? 160 : 120
                        }}>
                            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
                                {nurse.label}
                            </Text>
                    
                            <Group position="apart" align="flex-end" spacing={0}>
                                <Text fw={700}>{moneyFormat(nurse.count, 0)}</Text>
                                <Text c={nurse.color} fw={700} size="sm" className={classes.statCount}>
                                    1 : { Math.round(nursePercent) }
                                </Text>
                            </Group>
                        </Box>
                        : <div className='flex flex-col items-center'>
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '14px'
                                }}
                            />
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '30px'
                                }}
                            />
                        </div>
                    }
                    {/* item */}
                    {
                        !loadingState.peopleOfMed.state 
                        ? <Box key={people.label} sx={{ borderBottomColor: people.color }} className={classes.stat} style={{
                            width: isBigScreen ? 100 : 120
                        }}>
                            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
                                {people.label}
                            </Text>
                    
                            <Group position="apart" align="flex-end" spacing={0}>
                                <Text fw={700}>{moneyFormat(people.count, 0)}</Text>
                            </Group>
                        </Box>
                        : <div className='flex flex-col items-center'>
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '14px'
                                }}
                            />
                            <Skeleton.Button 
                                active={true} 
                                size={'small'} 
                                shape={'default'}
                                style={{
                                    width: '160px',
                                    height: '30px'
                                }}
                            />
                        </div>
                    }
                </SimpleGrid>
            </div>
        
        </>
    );
}