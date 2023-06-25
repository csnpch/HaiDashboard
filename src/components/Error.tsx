import { MdRunningWithErrors } from "react-icons/md";

export default function Error({
    msg = '',
}) {
    return (
        <div style={{
            zIndex: 90
        }} className={`absolute wh-full flex-center flex-col animate-pulse`}>
            <div className={`text-[2.8rem] text-[#fa4646]`}>
                <MdRunningWithErrors />
            </div>
            <p className={`text-sm -mt-1.5`}>{ msg || 'ไม่สามารถดึงข้อมูลในส่วนนี้ได้' }</p>
        </div>
    )
}