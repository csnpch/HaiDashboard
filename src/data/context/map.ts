import { createContext } from 'react';


export interface MapContextInterface {
    refContainerHover: React.RefObject<HTMLDivElement>|null,
    contentSideDataProvince: {
        isOpen: boolean,
        setIsOpen: (isOpen: boolean) => void,
    },
    hover: {
        isHover: boolean
        setHover: (isHover: boolean) => void    
        valueIs: string
        setValue: (value: string) => void
    }
}


export const MapContext = createContext<MapContextInterface>({
    refContainerHover: null,
    contentSideDataProvince: {
        isOpen: false,
        setIsOpen: () => {},
    },
    hover: {
        isHover: false,
        setHover: () => {},
        valueIs: '',
        setValue: () => {}
    },
});