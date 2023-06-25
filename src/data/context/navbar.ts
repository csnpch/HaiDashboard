import { typeDropDownState } from '@/interfaces/type/navbar';
import { createContext } from 'react';


export interface NavbarDropdownContextInterface {
    state: typeDropDownState
    setState: (state: typeDropDownState) => void
}


export const NavbarDropdownContext = createContext<NavbarDropdownContextInterface>({
    state: 'none',
    setState: () => {},
});