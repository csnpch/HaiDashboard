import { useState } from "react";
import { Box, Button, Input, Modal, Paper, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Role } from "@/interfaces/type/types";
import { InviteServices } from "@/services/api/hospital/moderator/invite";
import { timerSwal } from "@/utils/sweetAlert";

interface inviteStateInterface {
    email: string | null,
    role: Role
}

interface InviteModalProps {
    mainOpen: boolean,
    mainClose: () => void
}

export default function InviteModal({ mainOpen, mainClose }: InviteModalProps) {
    const BASE_URL = `${window.location.origin}/register-invite?code=`

    const [inviteState, setInviteState] = useState<inviteStateInterface>({ email: null, role: "guest" });
    const [inviteLink, setInviteLink] = useState<string>("");
    const [copy, setCopy] = useState<boolean>(false);

    const [opened, { open, close}] = useDisclosure();

    const RoleOptions: { value: Role, label: string }[] = [
        { value: "administrator", label: "Administator" },
        { value: "moderator", label: "Moderator" },
        { value: "guest", label: "Guest" },
        { value: "developer", label: "Developer" }
    ];

    const GenerateHandler = async () => {
        if (inviteState.email !== null) {
            console.log(inviteState)
            try {
                const res = await InviteServices.createInvite(inviteState.email, inviteState.role);
                if (res.status_code == 200) {
                    const inviteURL = `${BASE_URL}${res.data.invite_code}`;
                    setInviteLink(inviteURL); // Invite Code only
                    navigator.clipboard.writeText(inviteURL);
    
                    mainClose();
                    open();
                } else {
                    mainClose();

                    timerSwal({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        // @ts-ignore
                        subTitle: res.error.message,
                        timer: 2500
                    })
                }
            } catch (error) {
                console.error(error);
                mainClose();

                timerSwal({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    subTitle: `${error}`,
                    timer: 2500
                })
            }
        }
    }

    const copyHandler = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopy(true);
        setTimeout(() => setCopy(false), 1000);
    }

    return (
        <>
            <Modal opened={mainOpen} onClose={mainClose} size={`md`} padding={`sm`} shadow={`md`} centered radius={`md`}>
                <div className={`flex-row content-center justify-center`}>
                    <span className={`text-2xl text-[#0040A0] flex justify-center`}>เชิญผู้ใช้งาน</span>

                    <div className={`mt-2 p-8 pt-2`}>
                        <Input.Wrapper label="อีเมลล์ที่ต้องการเชิญ">
                            <Input
                                placeholder="example@ha.or.th"
                                type={`email`} 
                                onChange={e => setInviteState({ ...inviteState, email: e.currentTarget.value })}
                            />
                        </Input.Wrapper>

                        <Box pos={`relative`}>
                            <Select
                                label="บทบาท"
                                dropdownPosition={`bottom`}
                                data={RoleOptions}
                                defaultValue={RoleOptions[2].value}
                                onSelect={e => setInviteState({ ...inviteState, role: e.currentTarget.value as Role })}
                                className={`mt-3`}
                            />
                        </Box>
                    </div>

                    <div className={`flex-row justify-center p-8 pt-0 pb-4`}>
                        <Button className={`w-full bg-[#2563EB] hover:bg-[#1452DA]`} onClick={GenerateHandler}>สร้างลิ้งค์เชิญผู้ใช้งาน</Button>
                        <Button className={`w-full mt-2 bg-[#848484] hover:bg-[#737373]`} onClick={mainClose}>ยกเลิก</Button>
                    </div>
                </div>
            </Modal>

            <Modal opened={opened} onClose={close} size={`md`} padding={`sm`} shadow={`md`} centered radius={`md`}>
                <div className={`flex-row content-center justify-center`}>
                    <span className={`text-2xl text-[#0040A0] flex justify-center`}>เชิญผู้ใช้งาน</span>

                    <div className={`mt-2 p-8 pt-2`}>
                        <span>
                            เชิญผู้ใช้งานสำเร็จ
                            <span className={`text-[#234AA0]`}> ({ inviteState.role })</span>
                        </span>
                        <Paper className={`mt-2`} p={`sm`} style={{ textOverflow: `ellipsis`, overflow: `hidden` }} withBorder>{inviteLink}</Paper>
                    </div>

                    <div className={`flex-row justify-center p-8 pt-0 pb-4`}>
                        <Button 
                            className={
                                `w-full 
                                ${copy ? 
                                    `bg-[#2BA600] hover:bg-[#1A9500]` : 
                                    `bg-[#2563EB] hover:bg-[#1452DA]`
                                }`
                            } 
                            onClick={copyHandler}
                        >
                            {copy ? `คัดลอก URL เรียบร้อย` : `คัดลอก URL`}
                        </Button>
                        <Button className={`w-full mt-2 bg-[#848484] hover:bg-[#737373]`} onClick={close}>ปิด</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}