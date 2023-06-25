import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Anchor, Breadcrumbs, Button, Pagination, Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from 'react-router-dom'
import { FaPlus, FaUserCog } from 'react-icons/fa'

import Main from '@/components/layout/Main'
import ContentContainer from '@/components/container/ContentContainer'
import { routes } from '@/router'
import { UserServices } from '@/services/api/hospital/user'
import { swal } from '@/utils/sweetAlert'
import TableItem from './components/tableItem'

import { AllUsersResponse } from '@/interfaces/type/types'
import InviteModal from './components/inviteModal'

export default function UserManagePage() {
    const BreedcrumbsItems = [
        { name: 'Home', href: routes.root },
        { name: 'User Manage', href: routes.user_manage },
    ].map((item, index) => {
        return <Anchor key={index} component={Link} to={item.href.path}>{item.name}</Anchor>
    });

    const [loading, setLoading] = useState<boolean>(true)
    const [users, setUsers] = useState<AllUsersResponse["data"]["user_informations"]>([])
    const [dataPage, setDataPage] = useState<AllUsersResponse["data"]["pagination"]>()
    const [onPage, setOnPage] = useState<AllUsersResponse["data"]["pagination"]["CurrentPage"]>(1)

    const [opened, { open, close }] = useDisclosure();

    const msgNoData = "ไม่พบข้อมูลผู้ใช้งาน"

    useEffect(() => {
        if (onPage) {
            fetchUsers()
        }
    }, [onPage])

    // setInterval(() => console.log(users), 5000)

    const fetchUsers = async () => {
        try {
            const res = await UserServices.getAllUsers(onPage, 10)
            if (res.status_code === 200) {
                setUsers(res.data.user_informations)
                setDataPage(res.data.pagination)
                setLoading(false)
            } else {
                throw new Error(res.data.message)
            }
        } catch (error) {
            console.error(error)
            swal.fire({
                position: 'center',
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }

    return (
        <>
            <Helmet>
                <title>User Manage | HAI</title>
            </Helmet>

            <Main className={`wh-full`} gapNavbar={`gap-y-4`}>

                <ContentContainer className={`h-full`}>

                    <Breadcrumbs>{ BreedcrumbsItems }</Breadcrumbs>

                    <div className={`flex-row content-center mt-8 mr-4 ml-4`}>
                        <h1 className={`text-2xl font-normal mb-4`}><FaUserCog /> <span style={{ fontSize: "24px" }}>จัดการผู้ใช้งาน</span></h1>

                        <Table verticalSpacing={`sm`} className={`h-auto overflow-auto`}>
                            <thead className={`bg-[#f1f1f1]`}>
                                <tr key={0}>
                                    <th><span className={`text-[#234AA0]`}>#</span></th>
                                    <th><span className={`text-[#234AA0]`}>ชื่อเต็ม</span></th>
                                    <th><span className={`text-[#234AA0]`}>อีเมลล์</span></th>
                                    <th><span className={`text-[#234AA0]`}>อีเมลล์ที่เชิญ</span></th>
                                    <th><span className={`text-[#234AA0]`}>บทบาท</span></th>
                                    <th><span className={`text-[#234AA0]`}>จัดการ</span></th>
                                </tr>
                            </thead>

                            <tbody>
                                { (users !== null && users.length > 0) && users.map((value, key) => {
                                    return <TableItem
                                        key={key} 
                                        user={value}
                                    />
                                }) }

                                { loading && <tr><td colSpan={6} className={`text-center`}>Loading...</td></tr> }

                                { (!loading && users == null) && <tr><td colSpan={6} className={`text-center`}>{ msgNoData }</td></tr> }
                            </tbody>
                        </Table>

                        <div className={`w-full flex justify-end`}>
                            <Pagination
                                onChange={(page) => setOnPage(page)}
                                className={`mt-4`}
                                total={dataPage?.TotalPage || 1}
                                radius={`md`}
                            />
                        </div>

                        <div className={`flex justify-center mt-8 w-full`}>
                            <Button size={`sm`} color={`blue`} className={`bg-[#2563EB]`} onClick={open}><FaPlus className={`mr-2`} /> เพิ่มผู้ใช้งาน</Button>
                        </div>

                    </div>

                    <InviteModal
                        mainOpen={opened}
                        mainClose={close}
                    />

                </ContentContainer>
                
            </Main>
        </>
    )
}
