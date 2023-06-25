import { regional_health } from '@/data/dict/regional_health';
import { regionalHealthFilter } from '@/data/json/filter_data.json'
import provinceData from '@/data/json/mock_province.json'


interface rgbInterface {
    red: number;
    green: number;
    blue: number;
}


export const _class = (classString: string = '') => {
    return classString
        .trim()
        .replaceAll(/\s+/g, ' ')
        .replaceAll('undefined', '')
        .replaceAll('null', '')
        .replaceAll('false', '')
}


export const moneyFormat = (amount: number, unitDecimal = 2): string => {
    if (amount.toString().includes('.')) 
        return amount.toString()
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: unitDecimal,
        maximumFractionDigits: unitDecimal,
    });
}


export const subString = (
    value: string, 
    length: number, 
    valueAfterSubString = ''
): string => {
    try {
        return value.substring(0, length) + (value.length >= length ? valueAfterSubString : '')
    } catch (_) {
        return value
    }
}


export const addZero = (value: number): string => value < 10 ? `0${value}` : `${value}`


export const isBrightColor = (hexCode: string, threshold = 180) => {
    
    const calculateBrightness = (rgb: rgbInterface) => {
        const { red, green, blue } = rgb;
        return (red + green + blue) / 3;
    };

    const red = parseInt(hexCode.substr(1, 2), 16);
    const green = parseInt(hexCode.substr(3, 2), 16);
    const blue = parseInt(hexCode.substr(5, 2), 16);
    calculateBrightness({ red, green, blue });

    const brightness = calculateBrightness({
        red,
        green,
        blue,
    });
    
    return brightness >= threshold;
}


export const getRegionalHealthNameFromId = (id: number): string => {
    return regionalHealthFilter.find((item) => item.id === id)?.label || 'ไม่พบข้อมูล'
}


export const findRegionHealthIdByProvinceName = (province_name: string): number => {
    return provinceData.find((item) => item.name === province_name)?.region_health_key || 0
}


export const findRegionHealthNameByProvinceName = (province_name: string): string => {
    return getRegionalHealthNameFromId(findRegionHealthIdByProvinceName(province_name))
}


export const CheckProvinceBangkokName = (id: number, province_name: string): string => {

    const bangkokSlug = `กรุงเทพฯ`

    if (id !== regional_health.thirteen.id) return province_name
    if (province_name === bangkokSlug) {
        return province_name
    } else {
        return bangkokSlug
    }

}


export const zeroPad = (num: any, places = 2) => String(num).padStart(places, '0')
export const checkProvinceBangkok = (id: number, province_name: string) => {
    if (id === regional_health.thirteen.id) {
        return 'กรุงเทพ'
    }
    return province_name
}


export const getAnyValueShowToColumn = (value: any): any => {
    try {
        return value.toFixed(2)
    } catch (error) {
        return typeof value === 'string' ? value : JSON.stringify(value)
    }
}