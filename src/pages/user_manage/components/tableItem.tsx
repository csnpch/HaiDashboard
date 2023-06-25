import { Role, User } from "@/interfaces/type/types"
import { Button } from "@mantine/core"
import { FaCircle, FaPencilAlt, FaTrash } from "react-icons/fa"

export default function TableItem({ user, key }: { user: User, key: number }) {

    const RoleColor = (role: Role) => {
        switch (role) {
            case "administrator":
                return `text-black`
            case "moderator":
                return `text-yellow-500`
            case "guest":
                return `text-green-500`
            case "developer":
                return `text-blue-500`
            default:
                return `text-gray-500`
        }
    }

    const RoleFormat = (role: Role) => " " + role.charAt(0).toUpperCase() + role.slice(1)

    return (
        <tr key={key}>
            <td>{user.id}</td>
            <td>{`${user.first_name} ${user.last_name}`}</td>
            <td>{user.email_address}</td>
            <td>{ user.affiliate_by }</td>
            <td>
                <span className={`px-2 py-1 rounded-md border`}>
                    <FaCircle size={`10px`} className={RoleColor(user.role_name)} />
                    { RoleFormat(user.role_name) }
                </span>
            </td>
            <td>
                <Button size={`xs`} color={`yellow`} className={`mr-1`}><FaPencilAlt /></Button>
                <Button size={`xs`} color={`red`} className={`ml-1`}><FaTrash /></Button>
            </td>
        </tr>
    )
}