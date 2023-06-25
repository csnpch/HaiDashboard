import Swal, { SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// interface swalTimer {
//     icon?: string,
//     title: string,
//     timer?: number
// }


interface timerInterface {
    icon: SweetAlertIcon
    title: string
    timer: number
    subTitle?: string
    classes?: {
        title?: string
    }
}


export const swal = withReactContent(Swal)
export const timerSwal = ({
    icon = 'success', 
    title,
    subTitle,
    timer = 1500,
    classes
}: timerInterface) => {
    swal.fire({
        icon: icon, 
        title: <span className={`text-[1.4rem] ${classes?.title}`}>{ title }</span>,
        text: subTitle,
        timer: timer,
        showConfirmButton: false,
    })
}