import { itemOfIndicator, regionCode, viewByType } from '@/interfaces/type/map';
import { createContext } from 'react';
import { regional_th } from '../dict/regional_th';
import { regional_health } from '../dict/regional_health';

export interface FilterContextInterface {
    filterUsing: 'regional'|'regional_health'
    onSearchHospital: {
        value: boolean,
        setValue: (value: boolean) => void,
    },
    regional: {
        code: regionCode
        setCode: (value: regionCode) => void
    }
    regional_health: {
        id: regionCode
        setId: (value: regionCode) => void
        label: string
        setLabel: (value: string) => void
    }
    indicator: {
        value: itemOfIndicator
        setValue: (value: itemOfIndicator) => void
    }
    year: {
        value: number
        setValue: (value: number) => void
    },
    map: {
        view_by: {
            state: viewByType,
            setState: (value: viewByType) => void
        },
        hospitalCode: {
            state: string,
            setState: (value: string) => void,
        },
        provinceSelected: {
            state: string,
            setState: (value: string) => void,
        }
    }
}


export const FilterContext = createContext<FilterContextInterface>({
    filterUsing: 'regional_health',
    onSearchHospital: {
        value: false,
        setValue: () => {}
    },
    regional: {
        code: regional_th.th.code,
        setCode: () => {}
    },
    regional_health: {
        id: regional_health.all.id,
        setId: () => {},
        label: regional_health.all.label,
        setLabel: () => {},
    },
    indicator: {
        value: "CMI",
        setValue: () => {}
    },
    year: {
        value: new Date().getFullYear(),
        setValue: () => {}
    },
    map: {
        view_by: {
            state: 'regional_health',
            setState: () => {}
        },
        hospitalCode: {
            state: '',
            setState: () => {}
        },
        provinceSelected: {
            state: '',
            setState: () => {}
        }
    }
});